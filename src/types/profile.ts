
export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  website: string | null;
  description: string | null;
  email_visible: boolean;
  email?: string | null;
  gender: string | null;
  birth_date: string | null;
  level: string;
  created_at: string;
  updated_at: string;
  category?: string | null;
  categories?: string[] | null;
  preferred_language?: string | null;
  speaks_languages?: string[] | null;
  learning_languages?: string[] | null;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  created_at: string;
}

export interface Project {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  image_url?: string | null;
  categories?: string[];
  created_at: string;
  updated_at: string;
}

export type SocialPlatform = 'instagram' | 'twitter' | 'github' | 'linkedin' | 'spotify' | 'youtube' | 'tiktok' | 'website' | 'email';

export const socialPlatformIcons: Record<SocialPlatform, string> = {
  instagram: 'instagram',
  twitter: 'twitter',
  github: 'github',
  linkedin: 'linkedin',
  spotify: 'music',
  youtube: 'youtube',
  tiktok: 'video',
  website: 'link',
  email: 'mail'
};

export const socialPlatformLabels: Record<SocialPlatform, { es: string, en: string }> = {
  instagram: { es: 'Instagram', en: 'Instagram' },
  twitter: { es: 'Twitter', en: 'Twitter' },
  github: { es: 'GitHub', en: 'GitHub' },
  linkedin: { es: 'LinkedIn', en: 'LinkedIn' },
  spotify: { es: 'Spotify', en: 'Spotify' },
  youtube: { es: 'YouTube', en: 'YouTube' },
  tiktok: { es: 'TikTok', en: 'TikTok' },
  website: { es: 'Sitio Web', en: 'Website' },
  email: { es: 'Correo Electrónico', en: 'Email' }
};
