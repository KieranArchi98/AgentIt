import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <SettingsIcon className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">User settings and preferences will be available here.</p>
      </div>
    </div>
  );
} 