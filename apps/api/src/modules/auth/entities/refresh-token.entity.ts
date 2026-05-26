import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "../../../common/entities";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "refresh_tokens" })
@Index("idx_refresh_tokens_user_id", ["userId"])
@Index("uniq_refresh_tokens_token_hash", ["tokenHash"], { unique: true })
export class RefreshTokenEntity extends AppBaseEntity {
  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "token_hash", type: "varchar", length: 255 })
  tokenHash!: string;

  @Column({ name: "token_family", type: "varchar", length: 80, nullable: true })
  tokenFamily!: string | null;

  @Column({ name: "device_name", type: "varchar", length: 120, nullable: true })
  deviceName!: string | null;

  @Column({ name: "expires_at", type: "timestamptz" })
  expiresAt!: Date;

  @Column({ name: "revoked_at", type: "timestamptz", nullable: true })
  revokedAt!: Date | null;

  @Column({ name: "last_used_at", type: "timestamptz", nullable: true })
  lastUsedAt!: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;
}
