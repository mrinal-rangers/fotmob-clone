import { z } from "zod";

export const GoogleSignInSchema = z.object({
  idToken: z.string().min(1),
});

export type GoogleSignInInput = z.infer<typeof GoogleSignInSchema>;
