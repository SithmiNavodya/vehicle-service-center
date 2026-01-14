// src/components/Profile/ProfileSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, Bell, Shield, HelpCircle } from 'lucide-react';

const ProfileSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
    { path: '/profile/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
    { path: '/profile/notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { path: '/profile/security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
    { path: '/profile/help', label: 'Help & Support', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebar;