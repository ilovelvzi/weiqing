import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  nickname?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatarUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(80)
  @Max(230)
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  initialWeightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  targetWeightKg?: number;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;
}
