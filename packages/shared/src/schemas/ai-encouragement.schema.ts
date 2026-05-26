import { z } from "zod";
import { AiTone } from "../enums";

export const aiEncouragementOutputSchema = z.object({
  title: z.string().min(2).max(30),
  message: z.string().min(10).max(160),
  tone: z.nativeEnum(AiTone),
  tags: z.array(z.string().min(1).max(12)).max(4)
});

export type AiEncouragementOutput = z.infer<typeof aiEncouragementOutputSchema>;
