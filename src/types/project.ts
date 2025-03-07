export interface Project {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  long_description?: string | null;
  image_url?: string | null;
  website_url?: string | null;
  category: string;
  categories?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  username?: string;
  avatar_url?: string | null;
  profiles?: {
    username: string;
    avatar_url?: string | null;
  };
}

export interface ProjectWithProfile extends Project {
  username: string;
  avatar_url?: string | null;
}
