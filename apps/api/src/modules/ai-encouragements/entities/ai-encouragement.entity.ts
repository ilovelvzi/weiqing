import { AiTone } from "@weiqing/shared";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne
} from "typeorm";
import { AppBaseEntity } from "../../../common/entities";
import { UserEntity } from "../../users/entities/user.entity";
import { WeightRecordEntity } from "../../weight-records/entities/weight-record.entity";

@Entity({ name: "ai_encouragements" })
@Index("idx_ai_encouragements_user_created_at", ["userId", "createdAt"])
export class AiEncouragementEntity extends AppBaseEntity {
  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "weight_record_id", type: "uuid" })
  weightRecordId!: string;

  @Column({ name: "title", type: "varchar", length: 80 })
  title!: string;

  @Column({ name: "message", type: "text" })
  message!: string;

  @Column({
    name: "tone",
    type: "enum",
    enum: AiTone,
    enumName: "ai_tone_enum",
    default: AiTone.GENTLE
  })
  tone!: AiTone;

  @Column({ name: "tags", type: "jsonb", default: () => "'[]'::jsonb" })
  tags!: string[];

  @Column({ name: "model", type: "varchar", length: 80 })
  model!: string;

  @Column({ name: "prompt_version", type: "varchar", length: 40 })
  promptVersion!: string;

  @Column({ name: "input_snapshot", type: "jsonb", nullable: true })
  inputSnapshot!: Record<string, unknown> | null;

  @Column({ name: "raw_output", type: "jsonb", nullable: true })
  rawOutput!: Record<string, unknown> | null;

  @Column({ name: "generated_at", type: "timestamptz" })
  generatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.aiEncouragements, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @OneToOne(() => WeightRecordEntity, (record) => record.aiEncouragement, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "weight_record_id" })
  weightRecord!: WeightRecordEntity;
}
