import { render, screen, fireEvent } from '@testing-library/react';
import { PostCard } from '../components/PostCard';
import { Post } from '@reddit-like-forum/shared';

const mockPost: Post = {
  id: '1',
  title: 'Test Post',
  content: 'Test Content',
  userId: 'user1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  votes: 0
};

describe('PostCard', () => {
  it('renders post title and content', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays vote count', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
}); 