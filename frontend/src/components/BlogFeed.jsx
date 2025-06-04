import React from 'react';
import { BookOpen, PenTool, ChevronRight } from 'lucide-react';

const BlogFeed = ({ posts = [], isLoading = false }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-5 border-b border-indigo-200 dark:border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Posts from Your Study Buddies
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:shadow-sm transition-all cursor-pointer"
                onClick={() => console.log('View post', post.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {post.author}
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                <div className="mt-3 flex justify-end">
                  <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors">
                    Read more <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-gray-600 dark:text-gray-300 font-medium mb-1">No posts yet</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your study buddies haven't shared any posts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;
