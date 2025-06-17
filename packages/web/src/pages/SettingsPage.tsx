import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Bell, Mail, Shield, User, Eye, Moon } from 'lucide-react';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Eye },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="border-t border-gray-200">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src="https://api.dicebear.com/7.x/avatars/svg?seed=CurrentUser"
                      className="h-16 w-16"
                    />
                    <Button variant="outline">Change Avatar</Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Display Name
                      </label>
                      <Input
                        type="text"
                        defaultValue="CurrentUser"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input
                        type="email"
                        defaultValue="user@example.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        defaultValue="Tech enthusiast and software developer."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3">
                        <label className="text-sm font-medium text-gray-700">
                          Email notifications
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive email notifications when someone replies to your posts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3">
                        <label className="text-sm font-medium text-gray-700">
                          Browser notifications
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive browser notifications for new messages
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3">
                        <label className="text-sm font-medium text-gray-700">
                          Show online status
                        </label>
                        <p className="text-sm text-gray-500">
                          Let others see when you're online
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3">
                        <label className="text-sm font-medium text-gray-700">
                          Private profile
                        </label>
                        <p className="text-sm text-gray-500">
                          Only registered members can see your profile
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Appearance Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Dark Mode
                        </label>
                        <p className="text-sm text-gray-500">
                          Switch between light and dark theme
                        </p>
                      </div>
                      <Button variant="outline">
                        <Moon className="h-4 w-4 mr-2" />
                        Toggle Theme
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button variant="outline" className="mr-3">
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 