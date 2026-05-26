import { TrendRange } from "@weiqing/shared";
import { IsEnum, IsOptional } from "class-validator";

export class TrendQueryDto {
  @IsOptional()
  @IsEnum(TrendRange)
  range: TrendRange = TrendRange.THIRTY_DAYS;
}
