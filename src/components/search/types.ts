
export interface Profile {
  id: string;
  username: string;
  level: string;
  category: string;
  avatar_url: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
}

export interface Debate {
  id: string;
  title: string;
  content: string;
  category: string;
  author_username: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl: string;
}
