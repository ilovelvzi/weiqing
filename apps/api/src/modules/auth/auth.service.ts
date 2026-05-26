import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { AiTone, AppTheme, UserStatus, WeightUnit } from "@weiqing/shared";
import * as argon2 from "argon2";
import { randomUUID } from "crypto";
import { IsNull, Repository } from "typeorm";
import { JwtPayload } from "../../common/types";
import { UserProfileEntity, UserSettingsEntity, UserEntity } from "../users/entities";
import { UsersService } from "../users/users.service";
import { LoginDto, LogoutDto, RefreshTokenDto, RegisterDto } from "./dto";
import { RefreshTokenEntity } from "./entities";

export interface AuthResponseDto {
  user: ReturnType<UsersService["toCurrentUserDto"]>;
  accessToken: string;
  refreshToken: string;
}

interface RefreshPayload extends JwtPayload {
  jti: string;
  family: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly profilesRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserSettingsEntity)
    private readonly settingsRepository: Repository<UserSettingsEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokensRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const email = dto.email.trim();
    const emailNormalized = this.normalizeEmail(dto.email);

    const existing = await this.usersRepository.findOne({
      where: { emailNormalized, deletedAt: IsNull() },
      withDeleted: true
    });

    if (existing && !existing.deletedAt) {
      throw new ConflictException({
        code: "AUTH_EMAIL_ALREADY_REGISTERED",
        message: "Email is already registered"
      });
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.usersRepository.save(
      this.usersRepository.create({
        email,
        emailNormalized,
        passwordHash,
        status: UserStatus.ACTIVE
      })
    );

    const profile = await this.profilesRepository.save(
      this.profilesRepository.create({
        userId: user.id,
        nickname: dto.nickname ?? null
      })
    );
    const settings = await this.settingsRepository.save(
      this.settingsRepository.create({
        userId: user.id,
        weightUnit: WeightUnit.KG,
        theme: AppTheme.SYSTEM,
        aiTonePreference: AiTone.GENTLE
      })
    );

    user.profile = profile;
    user.settings = settings;

    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { emailNormalized: this.normalizeEmail(dto.email) },
      relations: { profile: true, settings: true }
    });

    if (!user) {
      throw this.invalidCredentials();
    }

    this.assertCanLogin(user);

    const passwordMatches = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordMatches) {
      throw this.invalidCredentials();
    }

    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    return this.createAuthResponse(user, dto.deviceName);
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
      relations: { profile: true, settings: true }
    });

    if (!user) {
      throw new UnauthorizedException({
        code: "AUTH_INVALID_REFRESH_TOKEN",
        message: "Invalid refresh token"
      });
    }

    this.assertCanLogin(user);

    const storedToken = await this.findValidRefreshToken(user.id, payload.family, dto.refreshToken);
    storedToken.revokedAt = new Date();
    storedToken.lastUsedAt = new Date();
    await this.refreshTokensRepository.save(storedToken);

    return this.createAuthResponse(user, storedToken.deviceName ?? undefined, payload.family);
  }

  async logout(userId: string, dto: LogoutDto): Promise<{ loggedOut: true }> {
    if (dto.refreshToken) {
      const payload = await this.verifyRefreshToken(dto.refreshToken);
      const storedToken = await this.findValidRefreshToken(userId, payload.family, dto.refreshToken);
      storedToken.revokedAt = new Date();
      storedToken.lastUsedAt = new Date();
      await this.refreshTokensRepository.save(storedToken);
    }

    return { loggedOut: true };
  }

  private async createAuthResponse(
    user: UserEntity,
    deviceName?: string,
    tokenFamily?: string
  ): Promise<AuthResponseDto> {
    const family = tokenFamily ?? randomUUID();
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user, family);
    const refreshPayload = this.jwtService.decode(refreshToken) as RefreshPayload;

    await this.refreshTokensRepository.save(
      this.refreshTokensRepository.create({
        userId: user.id,
        tokenHash: await argon2.hash(refreshToken),
        tokenFamily: family,
        deviceName: deviceName ?? null,
        expiresAt: new Date(refreshPayload.exp ? refreshPayload.exp * 1000 : Date.now())
      })
    );

    return {
      user: this.usersService.toCurrentUserDto(user),
      accessToken,
      refreshToken
    };
  }

  private signAccessToken(user: UserEntity): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      status: user.status
    };

    return this.jwtService.signAsync(payload, {
      secret: this.requireConfig("jwt.accessSecret"),
      expiresIn: this.configService.get<string>("jwt.accessExpiresIn", "15m")
    });
  }

  private signRefreshToken(user: UserEntity, tokenFamily: string): Promise<string> {
    const payload: RefreshPayload = {
      sub: user.id,
      email: user.email,
      status: user.status,
      jti: randomUUID(),
      family: tokenFamily
    };

    return this.jwtService.signAsync(payload, {
      secret: this.requireConfig("jwt.refreshSecret"),
      expiresIn: this.configService.get<string>("jwt.refreshExpiresIn", "30d")
    });
  }

  private async verifyRefreshToken(refreshToken: string): Promise<RefreshPayload> {
    try {
      return await this.jwtService.verifyAsync<RefreshPayload>(refreshToken, {
        secret: this.requireConfig("jwt.refreshSecret")
      });
    } catch {
      throw new UnauthorizedException({
        code: "AUTH_INVALID_REFRESH_TOKEN",
        message: "Invalid refresh token"
      });
    }
  }

  private async findValidRefreshToken(
    userId: string,
    tokenFamily: string,
    refreshToken: string
  ): Promise<RefreshTokenEntity> {
    const candidates = await this.refreshTokensRepository.find({
      where: {
        userId,
        tokenFamily,
        revokedAt: IsNull(),
        deletedAt: IsNull()
      },
      withDeleted: true
    });

    for (const candidate of candidates) {
      if (candidate.expiresAt <= new Date()) {
        continue;
      }

      if (await argon2.verify(candidate.tokenHash, refreshToken)) {
        return candidate;
      }
    }

    throw new UnauthorizedException({
      code: "AUTH_INVALID_REFRESH_TOKEN",
      message: "Invalid refresh token"
    });
  }

  private assertCanLogin(user: UserEntity): void {
    if (
      user.status === UserStatus.PENDING_DELETION ||
      user.status === UserStatus.DELETED ||
      user.status === UserStatus.SUSPENDED
    ) {
      throw new ForbiddenException({
        code: "AUTH_USER_FORBIDDEN",
        message: "User is not allowed to login"
      });
    }
  }

  private invalidCredentials(): UnauthorizedException {
    return new UnauthorizedException({
      code: "AUTH_INVALID_CREDENTIALS",
      message: "Invalid email or password"
    });
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private requireConfig(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(`${key} is required`);
    }

    return value;
  }
}
