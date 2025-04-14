export type ContentType = 'article' | 'video' | 'guide' | 'resource';
export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | string;

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
  
  // Article specific fields
  source?: string;
  externalUrl?: string;
  
  // Video specific fields
  videoUrl?: string; // For videos
  videoId?: string; // YouTube video ID
  duration?: string; // Video duration
  
  // Guide specific fields
  difficulty?: DifficultyLevel;
  downloadUrl?: string;
  
  // Resource specific fields
  resourceType?: string; // template, tool, book, course, etc.
  resourceUrl?: string; // For resources
  price?: string; // free, freemium, paid
  
  // Common fields
  created_at: string;
  updated_at: string;
  category: string;
  published: boolean;
}
