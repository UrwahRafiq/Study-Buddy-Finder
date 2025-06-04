import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Plus, ChevronRight } from 'lucide-react';
import axios from 'axios';

const MyBlogPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          console.warn('Missing auth token or user ID.');
          return;
        }

        const res = await axios.get(
          `http://localhost:1337/api/blog-posts?filters[author][id][$eq]=${userId}&sort=createdAt:desc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPosts(
          res.data.data.map((item) => ({
            id: item.id,
            title: item.attributes.title,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-5 border-b border-indigo-200 dark:border-indigo-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              My Blog Posts
            </h3>
          </div>
          <button
            onClick={() => navigate('/my-posts')}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <ul className="space-y-3">
              {posts.map((post, index) => (
                <li
                  key={post.id}
                  className="group flex items-center justify-between gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm cursor-pointer transition-all"
                  onClick={() => navigate(`/my-posts/${post.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        index % 3 === 0
                          ? 'bg-indigo-500'
                          : index % 3 === 1
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    ></div>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {post.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total posts
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                  {posts.length}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-3">
              <Edit3 className="w-8 h-8 text-indigo-400 dark:text-indigo-300" />
            </div>
            <h4 className="text-gray-600 dark:text-gray-300 font-medium mb-1">
              No blog posts yet
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Share your knowledge and experiences with the community
            </p>
            <button
              onClick={() => navigate('/my-posts')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create First Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogPosts;