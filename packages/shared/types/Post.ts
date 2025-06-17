export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string;
  content: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  voteType: 'up' | 'down';
  createdAt: string;
} 