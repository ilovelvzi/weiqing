import { Mood, RecordSource } from "@weiqing/shared";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min
} from "class-validator";

export class CreateWeightRecordDto {
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg!: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  localDate!: string;

  @IsString()
  @MaxLength(80)
  timezone!: string;

  @IsOptional()
  @IsEnum(Mood)
  mood?: Mood;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsEnum(RecordSource)
  source?: RecordSource;
}
