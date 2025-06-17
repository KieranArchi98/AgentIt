import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '@reddit-like-forum/shared';
import { formatDate } from '../utils/formatDate';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Link to={`/posts/${post.id}`} className="block">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.content}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Posted {formatDate(post.createdAt)}</span>
          <div className="flex items-center space-x-2">
            <span>{post.votes || 0} votes</span>
          </div>
        </div>
      </Link>
    </div>
  );
} 