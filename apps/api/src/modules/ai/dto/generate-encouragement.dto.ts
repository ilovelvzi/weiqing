import { IsUUID } from "class-validator";

export class GenerateEncouragementDto {
  @IsUUID()
  weightRecordId!: string;
}
