
import { z } from "zod";

export const getProfileFormSchema = (currentLanguage: string) => {
  return z.object({
    username: z.string().optional(),
    description: z.string().optional(),
    email_visible: z.boolean().default(false),
    website: z.string().optional(),
    gender: z.string().optional(),
    birth_date: z.string().optional(),
    categories: z.array(z.string()).optional(),
  });
};

export const profileFormSchema = z.object({
  username: z.string().optional(),
  description: z.string().optional(),
  email_visible: z.boolean().default(false),
  website: z.string().optional(),
  gender: z.string().optional(),
  birth_date: z.string().optional(),
  categories: z.array(z.string()).optional(),
});
