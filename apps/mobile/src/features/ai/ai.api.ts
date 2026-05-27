import type { AiTone } from "@weiqing/shared";
import { apiClient } from "../../services";

export interface SafeAiEncouragementDto {
  id: string;
  weightRecordId: string;
  title: string;
  message: string;
  tone: AiTone;
  tags: string[];
  generatedAt: string;
}

export interface GenerateEncouragementPayload {
  weightRecordId: string;
}

export interface GenerateEncouragementResponse {
  encouragement: SafeAiEncouragementDto | null;
  status: "ready" | "generating" | "failed" | "skipped";
}

export const aiApi = {
  generate: (payload: GenerateEncouragementPayload) =>
    apiClient.post<GenerateEncouragementResponse, GenerateEncouragementPayload>(
      "/ai/encouragements/generate",
      payload
    ),
  latest: () => apiClient.get<SafeAiEncouragementDto | null>("/ai/encouragements/latest")
};
