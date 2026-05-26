import { registerAs } from "@nestjs/config";

export interface AiConfig {
  deepseekApiKey?: string;
  deepseekModel: string;
  fallbackModel?: string;
  promptVersion: string;
  enableFallback: boolean;
  maxNoteChars: number;
}

export default registerAs(
  "ai",
  (): AiConfig => ({
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
    deepseekModel: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
    fallbackModel: process.env.DEEPSEEK_FALLBACK_MODEL ?? "deepseek-v4-pro",
    promptVersion: process.env.AI_PROMPT_VERSION ?? "v1",
    enableFallback: (process.env.AI_ENABLE_FALLBACK ?? "true") === "true",
    maxNoteChars: Number(process.env.AI_MAX_NOTE_CHARS ?? 200)
  })
);
