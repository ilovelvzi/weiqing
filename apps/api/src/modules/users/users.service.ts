import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  AccountDeletionStatus,
  CurrentUserDto,
  UserProfileDto,
  UserSettingsDto
} from "@weiqing/shared";
import { Repository } from "typeorm";
import { UpdateProfileDto, UpdateSettingsDto } from "./dto";
import { UserProfileEntity, UserSettingsEntity, UserEntity } from "./entities";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly profilesRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserSettingsEntity)
    private readonly settingsRepository: Repository<UserSettingsEntity>
  ) {}

  async findCurrentUser(userId: string): Promise<CurrentUserDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { profile: true, settings: true }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toCurrentUserDto(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileDto> {
    const profile = await this.profilesRepository.findOneBy({ userId });

    if (!profile) {
      throw new NotFoundException("User profile not found");
    }

    this.profilesRepository.merge(profile, dto);
    const saved = await this.profilesRepository.save(profile);
    return this.toProfileDto(saved);
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto): Promise<UserSettingsDto> {
    const settings = await this.settingsRepository.findOneBy({ userId });

    if (!settings) {
      throw new NotFoundException("User settings not found");
    }

    this.settingsRepository.merge(settings, dto);
    const saved = await this.settingsRepository.save(settings);
    return this.toSettingsDto(saved);
  }

  toCurrentUserDto(user: UserEntity): CurrentUserDto {
    return {
      id: user.id,
      email: user.email,
      status: user.status,
      profile: user.profile ? this.toProfileDto(user.profile) : null,
      settings: this.toSettingsDto(user.settings as UserSettingsEntity),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  toProfileDto(profile: UserProfileEntity): UserProfileDto {
    return {
      nickname: profile.nickname,
      gender: null,
      birthYear: null,
      heightCm: profile.heightCm,
      initialWeightKg: profile.initialWeightKg,
      targetWeightKg: profile.targetWeightKg,
      timezone: profile.user?.settings?.timezone ?? "Asia/Shanghai"
    };
  }

  toSettingsDto(settings: UserSettingsEntity): UserSettingsDto {
    return {
      preferredWeightUnit: settings.weightUnit,
      aiTonePreference: settings.aiTonePreference,
      appTheme: settings.theme,
      reminderEnabled: settings.reminderEnabled,
      reminderTime: settings.reminderTime,
      privacyModeEnabled: false,
      accountDeletionStatus: AccountDeletionStatus.REQUESTED
    };
  }
}
