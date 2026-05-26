import { Mood, RecordSource } from "@weiqing/shared";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne
} from "typeorm";
import { AppBaseEntity } from "../../../common/entities";
import { numericTransformer } from "../../../common/transformers";
import { AiEncouragementEntity } from "../../ai-encouragements/entities/ai-encouragement.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: "weight_records" })
@Index("idx_weight_records_user_local_date", ["userId", "localDate"])
@Index("idx_weight_records_user_recorded_at", ["userId", "recordedAt"])
export class WeightRecordEntity extends AppBaseEntity {
  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({
    name: "weight_kg",
    type: "numeric",
    precision: 5,
    scale: 2,
    transformer: numericTransformer
  })
  weightKg!: number;

  @Column({ name: "local_date", type: "date" })
  localDate!: string;

  @Column({ name: "timezone", type: "varchar", length: 80 })
  timezone!: string;

  @Column({
    name: "mood",
    type: "enum",
    enum: Mood,
    enumName: "mood_enum",
    nullable: true
  })
  mood!: Mood | null;

  @Column({ name: "note", type: "text", nullable: true })
  note!: string | null;

  @Column({
    name: "source",
    type: "enum",
    enum: RecordSource,
    enumName: "record_source_enum",
    default: RecordSource.MANUAL
  })
  source!: RecordSource;

  @Column({ name: "recorded_at", type: "timestamptz" })
  recordedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.weightRecords, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @OneToOne(() => AiEncouragementEntity, (encouragement) => encouragement.weightRecord)
  aiEncouragement?: AiEncouragementEntity;
}
