
import { z } from "zod";

export const profileFormSchema = z.object({
  username: z.string().min(2).max(50),
  description: z.string().optional(),
  email_visible: z.boolean().default(false),
  website: z.string().optional(),
  gender: z.string().optional(),
  birth_date: z.string().optional(),
  categories: z.array(z.string()).optional(),
  preferred_language: z.string().optional(),
  speaks_languages: z.array(z.string()).optional(),
  learning_languages: z.array(z.string()).optional(),
});
