
import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  description: z.string().max(220, {
    message: "Description cannot exceed 220 characters.",
  }),
  long_description: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  social_links: z.string().optional(),
  categories: z.array(z.string()).min(1, {
    message: "Select at least one category",
  }),
  tags: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export interface Project {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  image_url?: string;
  website_url?: string;
  category: string;
  categories?: string[];
  tags?: string[];
  profile_id: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
}
