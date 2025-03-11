
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
  videoUrl?: string; // For videos
  resourceUrl?: string; // For resources
  created_at: string;
  updated_at: string;
  category: string;
  published: boolean;
}
