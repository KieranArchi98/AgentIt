import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PostCard } from '@/components/forum/PostCard';
import { useUser } from '@clerk/clerk-react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { Post } from '@/hooks/useRealtimePosts';
import { BrowserRouter } from 'react-router-dom';

// Mock useUser hook
vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn()
}));

// Mock PostHog
vi.mock('@/lib/posthog', () => ({
  posthog: {
    capture: vi.fn()
  }
}));

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({ error: null }))
    }))
  }
}));

const mockPost = {
  id: '1',
  title: 'Test Post',
  content: 'Test content',
  user_id: 'user1',
  author_email: 'test@example.com',
  created_at: new Date().toISOString(),
  votes: 0,
  comment_count: 0
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('PostCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders post content correctly', () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isSignedIn: true,
      user: {
        id: '123',
        primaryEmailAddress: { emailAddress: 'test@example.com' }
      }
    });

    renderWithRouter(<PostCard post={mockPost} />);

    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
    expect(screen.getByText(`Posted by ${mockPost.author_email}`)).toBeInTheDocument();
  });

  it('shows voting buttons when user is signed in', () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isSignedIn: true,
      user: {
        id: '123',
        primaryEmailAddress: { emailAddress: 'test@example.com' }
      }
    });

    renderWithRouter(<PostCard post={mockPost} />);

    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });

  it('hides voting buttons when user is not signed in', () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isSignedIn: false,
      user: null
    });

    renderWithRouter(<PostCard post={mockPost} />);

    expect(screen.queryByLabelText('Upvote')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Downvote')).not.toBeInTheDocument();
  });

  it('shows delete button only for post author', () => {
    // Set user as post author
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isSignedIn: true,
      user: {
        id: mockPost.user_id,
        primaryEmailAddress: { emailAddress: mockPost.author_email }
      }
    });

    renderWithRouter(
      <PostCard
        post={mockPost}
        onComment={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByLabelText('Delete post')).toBeInTheDocument();

    // Change user to non-author
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isSignedIn: true,
      user: {
        id: 'different-user',
        primaryEmailAddress: { emailAddress: 'test@example.com' }
      }
    });

    renderWithRouter(
      <PostCard
        post={mockPost}
        onComment={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.queryByLabelText('Delete post')).not.toBeInTheDocument();
  });

  it('calls onComment when comment button is clicked', () => {
    const onComment = vi.fn();
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isSignedIn: true,
      user: {
        id: '123',
        primaryEmailAddress: { emailAddress: 'test@example.com' }
      }
    });

    renderWithRouter(<PostCard post={mockPost} onComment={onComment} />);

    fireEvent.click(screen.getByText(`Comment (${mockPost.comment_count})`));
    expect(onComment).toHaveBeenCalledWith(mockPost.id);
  });
}); 