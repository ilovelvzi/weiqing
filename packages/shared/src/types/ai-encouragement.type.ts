import type { AiTone } from "../enums";

export interface AiEncouragementDto {
  id: string;
  weightRecordId: string;
  title: string;
  message: string;
  tone: AiTone;
  tags: string[];
  model: string;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}
