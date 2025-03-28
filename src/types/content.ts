
export type ContentType = 'article' | 'video' | 'guide' | 'resource';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content?: string; // For articles and guides
  imageUrl: string;
  type: ContentType;
  author_id: string;
  author_username?: string;
  author_role?: string;
  videoUrl?: string; // For videos
  videoId?: string; // Added YouTube video ID
  resourceUrl?: string; // For resources
  created_at: string;
  updated_at: string;
  category: string;
  published: boolean;
}
