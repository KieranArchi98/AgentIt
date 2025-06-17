export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  votes?: number;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  value: 1 | -1;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
} 