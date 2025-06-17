import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { ForumPage } from '@/pages/ForumPage';
import { DiscussionPage } from '@/pages/DiscussionPage';
import { MembersPage } from '@/pages/MembersPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { CreatePostPage } from '@/pages/CreatePostPage';
import { ForumListPage } from '@/pages/ForumListPage';
import { PostPage } from '@/pages/PostPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'forums',
        element: <ForumListPage />,
      },
      {
        path: 'forum/:forumId',
        element: <ForumPage />,
      },
      {
        path: 'forum/:forumId/new-post',
        element: <CreatePostPage />,
      },
      {
        path: 'post/:postId',
        element: <PostPage />,
      },
      {
        path: 'discussion/:id',
        element: <DiscussionPage />,
      },
      {
        path: 'members',
        element: <MembersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'profile/:username',
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]); 