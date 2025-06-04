import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, User, GraduationCap, BookOpen, Heart, MessageSquare } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import SettingsButton from './SettingsButton';

const UserInfoSection = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('http://localhost:1337/api/users/me?populate=profilePicture', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
      .then((res) => {
        setUserData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const renderList = (items, fallback) =>
    Array.isArray(items) && items.length ? (
      <div className="flex flex-wrap gap-2 mt-1">
        {items.map((item, index) => (
          <span 
            key={index} 
            className="bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-sm text-indigo-700 dark:text-indigo-200 font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-gray-400 dark:text-gray-500 italic">{fallback}</span>
    );

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 animate-pulse">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex justify-center md:justify-start">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl self-center"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={
                userData.profilePicture?.url
                  ? `http://localhost:1337${userData.profilePicture.url}`
                  : '/default-profile.jpeg'
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg transition-transform group-hover:scale-105"
            />
            <div className="absolute -bottom-2 -right-2 bg-indigo-500 p-1.5 rounded-full shadow-md group-hover:scale-110 transition-transform">
              <div className="bg-white p-1 rounded-full">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">{userData.fullName || 'Your Name'}</h2>
            <p className="text-indigo-100/90 font-medium text-lg">
              {userData.degree || 'Your Degree'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/edit-profile')}
              title="Edit Profile"
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
            >
              <Edit className="w-5 h-5 text-white" />
            </button>

            <div className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <SettingsButton />
            </div>

            <div className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {userData.bio && (
          <div className="mb-8 p-5 bg-indigo-50/50 dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-gray-700 shadow-inner">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-2">About Me</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {typeof userData.bio === 'string' ? userData.bio : 'No bio available.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* University Card */}
          <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100/80 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-300 shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">University</h3>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {userData.university || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100/80 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-300 shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Courses</h3>
                {renderList(userData.courses, 'Not specified')}
              </div>
            </div>
          </div>

          {/* Interests Card */}
          <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100/80 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-300 shadow-inner">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Interests</h3>
                {renderList(userData.interests, 'Not specified')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoSection;