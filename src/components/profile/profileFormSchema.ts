
import { z } from "zod";

export const getProfileFormSchema = (currentLanguage: string) => {
  return z.object({
    username: z.string().min(3, {
      message:
        currentLanguage === "en"
          ? "Username must be at least 3 characters."
          : "El nombre de usuario debe tener al menos 3 caracteres.",
    }),
    description: z.string().optional(),
    email_visible: z.boolean().default(false),
    website: z.string().optional(),
    gender: z.string().optional(),
    birth_date: z.string().optional(),
    categories: z.array(z.string()).optional(),
  });
};

export const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  description: z.string().optional(),
  email_visible: z.boolean().default(false),
  website: z.string().optional(),
  gender: z.string().optional(),
  birth_date: z.string().optional(),
  categories: z.array(z.string()).optional(),
});
