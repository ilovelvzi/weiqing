import { IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class RequestDeleteAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsString()
  @Matches(/^DELETE$/)
  confirmText!: string;
}
