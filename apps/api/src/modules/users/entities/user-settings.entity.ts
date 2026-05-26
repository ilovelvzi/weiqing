import { AiTone, AppTheme, WeightUnit } from "@weiqing/shared";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { AppBaseEntity } from "../../../common/entities";
import { DEFAULT_TIMEZONE } from "@weiqing/shared";
import { UserEntity } from "./user.entity";

@Entity({ name: "user_settings" })
export class UserSettingsEntity extends AppBaseEntity {
  @Column({ name: "user_id", type: "uuid", unique: true })
  userId!: string;

  @Column({
    name: "weight_unit",
    type: "enum",
    enum: WeightUnit,
    enumName: "weight_unit_enum",
    default: WeightUnit.KG
  })
  weightUnit!: WeightUnit;

  @Column({ name: "reminder_enabled", type: "boolean", default: true })
  reminderEnabled!: boolean;

  @Column({ name: "reminder_time", type: "time", nullable: true })
  reminderTime!: string | null;

  @Column({ name: "timezone", type: "varchar", length: 80, default: DEFAULT_TIMEZONE })
  timezone!: string;

  @Column({
    name: "theme",
    type: "enum",
    enum: AppTheme,
    enumName: "app_theme_enum",
    default: AppTheme.SYSTEM
  })
  theme!: AppTheme;

  @Column({
    name: "ai_tone_preference",
    type: "enum",
    enum: AiTone,
    enumName: "ai_tone_enum",
    default: AiTone.GENTLE
  })
  aiTonePreference!: AiTone;

  @OneToOne(() => UserEntity, (user) => user.settings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;
}
