import { AiTone, AppTheme, WeightUnit } from "@weiqing/shared";
import { IsBoolean, IsEnum, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(WeightUnit)
  weightUnit?: WeightUnit;

  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  reminderTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  timezone?: string;

  @IsOptional()
  @IsEnum(AppTheme)
  theme?: AppTheme;

  @IsOptional()
  @IsEnum(AiTone)
  aiTonePreference?: AiTone;
}
