import { AiTone } from "@weiqing/shared";
import { AiEncouragementEntity } from "../ai-encouragements/entities";

export interface SafeAiEncouragementDto {
  id: string;
  weightRecordId: string;
  title: string;
  message: string;
  tone: AiTone;
  tags: string[];
  generatedAt: string;
}

export function toSafeAiEncouragementDto(
  encouragement: AiEncouragementEntity
): SafeAiEncouragementDto {
  return {
    id: encouragement.id,
    weightRecordId: encouragement.weightRecordId,
    title: encouragement.title,
    message: encouragement.message,
    tone: encouragement.tone,
    tags: encouragement.tags,
    generatedAt: encouragement.generatedAt.toISOString()
  };
}
