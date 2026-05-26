import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountDeletionStatus, UserStatus } from "@weiqing/shared";
import { In, IsNull, Repository } from "typeorm";
import { RefreshTokenEntity } from "../auth/entities";
import { UserEntity } from "../users/entities";
import { RequestDeleteAccountDto } from "./dto";
import { AccountDeletionRequestEntity } from "./entities";

export interface DeleteAccountResponseDto {
  status: AccountDeletionStatus;
  requestedAt: string;
  scheduledDeleteAt: string | null;
}

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountDeletionRequestEntity)
    private readonly deletionRequestsRepository: Repository<AccountDeletionRequestEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokensRepository: Repository<RefreshTokenEntity>
  ) {}

  async requestDeletion(userId: string, dto: RequestDeleteAccountDto): Promise<DeleteAccountResponseDto> {
    const user = await this.findUser(userId);
    const now = new Date();
    const scheduledDeleteAt = new Date(now);
    scheduledDeleteAt.setUTCDate(scheduledDeleteAt.getUTCDate() + 7);

    const deletionRequest = await this.deletionRequestsRepository.save(
      this.deletionRequestsRepository.create({
        userId,
        status: AccountDeletionStatus.REQUESTED,
        reason: dto.reason ?? null,
        requestedAt: now,
        scheduledDeleteAt
      })
    );

    user.status = UserStatus.PENDING_DELETION;
    await this.usersRepository.save(user);
    await this.refreshTokensRepository.update(
      { userId, revokedAt: IsNull(), deletedAt: IsNull() },
      { revokedAt: now }
    );

    return {
      status: deletionRequest.status,
      requestedAt: deletionRequest.requestedAt.toISOString(),
      scheduledDeleteAt: deletionRequest.scheduledDeleteAt?.toISOString() ?? null
    };
  }

  async cancelDeletion(userId: string): Promise<{ cancelled: true }> {
    const user = await this.findUser(userId);
    const request = await this.deletionRequestsRepository.findOne({
      where: {
        userId,
        status: In([AccountDeletionStatus.REQUESTED, AccountDeletionStatus.PROCESSING]),
        deletedAt: IsNull()
      },
      order: { requestedAt: "DESC" }
    });

    if (!request || (request.scheduledDeleteAt && request.scheduledDeleteAt <= new Date())) {
      throw new BadRequestException({
        code: "ACCOUNT_DELETION_NOT_CANCELLABLE",
        message: "No cancellable account deletion request found"
      });
    }

    request.status = AccountDeletionStatus.CANCELLED;
    await this.deletionRequestsRepository.save(request);

    user.status = UserStatus.ACTIVE;
    await this.usersRepository.save(user);

    return { cancelled: true };
  }

  private async findUser(userId: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, deletedAt: IsNull() }
    });

    if (!user) {
      throw new NotFoundException({
        code: "USER_NOT_FOUND",
        message: "User not found"
      });
    }

    return user;
  }
}
