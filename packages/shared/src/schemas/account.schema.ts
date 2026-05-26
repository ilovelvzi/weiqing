import { z } from "zod";

export const deleteAccountSchema = z.object({
  reason: z.string().max(300).optional(),
  confirmText: z.string().min(1).max(40)
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
