import { Injectable } from "@nestjs/common";
import { AiEncouragementInput } from "./ai-fallback.service";

@Injectable()
export class AiPromptService {
  buildSystemPrompt(): string {
    return [
      "You write short, supportive weight check-in encouragement for a mobile card.",
      "Safety boundaries:",
      "- Do not provide medical diagnosis.",
      "- Do not provide medication advice.",
      "- Do not recommend extreme dieting, fasting, purging, or excessive exercise.",
      "- Do not shame bodies.",
      "- Do not create anxiety.",
      "- Do not promise specific weight-loss results.",
      "- Keep the message brief and suitable for a mobile card.",
      "- Return JSON only."
    ].join("\n");
  }

  buildUserPrompt(input: AiEncouragementInput): string {
    return JSON.stringify(
      {
        task: "Generate one encouragement message.",
        outputShape: {
          title: "string, 2..30 chars",
          message: "string, 10..160 chars",
          tone: "gentle | celebration | comfort | reset",
          tags: "string[], max 4, each 1..12 chars"
        },
        input
      },
      null,
      2
    );
  }
}
