//Typescript interfaces for objects

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  parent_id: string | null;
  created_at: string;
  profile?: Profile;
  votes?: Vote[];
  voteCount?: number;
}

export interface Vote {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
  };
  likes: number;
  comments_count: number;
} 