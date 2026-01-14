// src/components/Profile/ProfileCard.jsx
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {profile?.firstName} {profile?.lastName}
          </h3>
          <p className="text-gray-600">{profile?.email}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {profile?.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
            )}

            {profile?.address && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{profile.address}</span>
              </div>
            )}

            {profile?.createdAt && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          to="/profile"
          className="block w-full text-center py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;