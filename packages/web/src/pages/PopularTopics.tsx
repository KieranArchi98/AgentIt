import { Star } from 'lucide-react';

export default function PopularTopics() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Star className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Popular Topics</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Most popular forum topics will be displayed here.</p>
      </div>
    </div>
  );
} 