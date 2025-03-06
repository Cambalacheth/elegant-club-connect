
export interface Debate {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_username: string;
  author_avatar?: string | null;
  author_role: string;
  created_at: string;
  updated_at: string;
  category: string;
  votes_up: number;
  votes_down: number;
  comments_count: number;
}

export interface Comment {
  id: string;
  debate_id: string;
  content: string;
  author_id: string;
  author_username: string;
  author_avatar?: string | null;
  author_role: string;
  created_at: string;
  votes_up: number;
  votes_down: number;
}

export interface Vote {
  id: string;
  user_id: string;
  reference_id: string; // can be debate_id or comment_id
  reference_type: 'debate' | 'comment';
  vote_type: 'up' | 'down';
  created_at: string;
}
