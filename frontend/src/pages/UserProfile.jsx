import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserInfoSection from '../components/UserInfoSection';
import ProgressTracker from '../components/ProgressTracker';
import UpcomingEvents from '../components/UpcomingEvents';
import MyBlogPosts from '../components/MyBlogPosts';
import FindBuddyCard from '../components/FindBuddyCard';
import UnreadMessagesCard from '../components/UnreadMessagesCard';
import BlogFeed from '../components/BlogFeed';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserProgress([
        "Completed Calculus homework",
        "Reviewed Data Structures notes",
        "Prepared for Physics exam"
      ]);

      setUnreadMessages([
        { sender: "Alex", preview: "Hey, are we still meeting tomorrow?" },
        { sender: "Study Group", preview: "New resources uploaded" }
      ]);

      setBlogPosts([
        { id: 1, author: 'Alex', content: "Here's how I passed my Data Structures final..." },
        { id: 2, author: 'Maya', content: "My favorite Pomodoro timer apps 🔥" },
      ]);

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <UserInfoSection />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <ProgressTracker progressItems={userProgress} isLoading={isLoading} />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <FindBuddyCard isLoading={isLoading} />
            </div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <BlogFeed posts={blogPosts} isLoading={isLoading} />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <MyBlogPosts posts={[]} isLoading={isLoading} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <UpcomingEvents isLoading={isLoading} />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <UnreadMessagesCard unreadMessages={unreadMessages} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
