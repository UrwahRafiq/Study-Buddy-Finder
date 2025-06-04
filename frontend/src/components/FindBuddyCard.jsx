import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Sparkles } from 'lucide-react';

const FindBuddyCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-5 border-b border-indigo-200 dark:border-indigo-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Find Study Buddies
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Connect with peers who share your academic goals and learning style.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/match-buddy')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>Match Me Automatically</span>
          </button>

          <button
            onClick={() => navigate('/search-buddy')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-600 dark:text-white dark:border-indigo-400 transition-colors text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            <span>Search Manually</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Quick actions
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
              2 options
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindBuddyCard;