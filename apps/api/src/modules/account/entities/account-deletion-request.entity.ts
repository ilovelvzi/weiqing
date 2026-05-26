import { AccountDeletionStatus } from "@weiqing/shared";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "../../../common/entities";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "account_deletion_requests" })
@Index("idx_account_deletion_requests_user_status", ["userId", "status"])
export class AccountDeletionRequestEntity extends AppBaseEntity {
  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({
    name: "status",
    type: "enum",
    enum: AccountDeletionStatus,
    enumName: "account_deletion_status_enum",
    default: AccountDeletionStatus.REQUESTED
  })
  status!: AccountDeletionStatus;

  @Column({ name: "reason", type: "text", nullable: true })
  reason!: string | null;

  @Column({ name: "requested_at", type: "timestamptz" })
  requestedAt!: Date;

  @Column({ name: "scheduled_delete_at", type: "timestamptz", nullable: true })
  scheduledDeleteAt!: Date | null;

  @Column({ name: "completed_at", type: "timestamptz", nullable: true })
  completedAt!: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.accountDeletionRequests, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;
}
