import { UserStatus } from "@weiqing/shared";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne
} from "typeorm";
import { AppBaseEntity } from "../../../common/entities";
import { AccountDeletionRequestEntity } from "../../account/entities/account-deletion-request.entity";
import { RefreshTokenEntity } from "../../auth/entities/refresh-token.entity";
import { AiEncouragementEntity } from "../../ai-encouragements/entities/ai-encouragement.entity";
import { UserProfileEntity } from "./user-profile.entity";
import { UserSettingsEntity } from "./user-settings.entity";
import { WeightRecordEntity } from "../../weight-records/entities/weight-record.entity";

@Entity({ name: "users" })
@Index("idx_users_status", ["status"])
export class UserEntity extends AppBaseEntity {
  @Column({ name: "email", type: "varchar", length: 255 })
  email!: string;

  @Column({ name: "email_normalized", type: "varchar", length: 255 })
  emailNormalized!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({
    name: "status",
    type: "enum",
    enum: UserStatus,
    enumName: "user_status_enum",
    default: UserStatus.ACTIVE
  })
  status!: UserStatus;

  @Column({ name: "email_verified_at", type: "timestamptz", nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ name: "last_login_at", type: "timestamptz", nullable: true })
  lastLoginAt!: Date | null;

  @OneToOne(() => UserProfileEntity, (profile) => profile.user)
  profile?: UserProfileEntity;

  @OneToOne(() => UserSettingsEntity, (settings) => settings.user)
  settings?: UserSettingsEntity;

  @OneToMany(() => WeightRecordEntity, (record) => record.user)
  weightRecords?: WeightRecordEntity[];

  @OneToMany(() => AiEncouragementEntity, (encouragement) => encouragement.user)
  aiEncouragements?: AiEncouragementEntity[];

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => AccountDeletionRequestEntity, (request) => request.user)
  accountDeletionRequests?: AccountDeletionRequestEntity[];
}
