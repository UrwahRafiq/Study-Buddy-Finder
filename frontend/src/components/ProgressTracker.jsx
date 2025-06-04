import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Trophy, ChevronRight } from 'lucide-react';
import axios from 'axios';

const ProgressTracker = () => {
  const navigate = useNavigate();
  const [progressItems, setProgressItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) return;

      try {
        const res = await axios.get(
          'http://localhost:1337/api/progress-goals?populate=*',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Progress Goals:', res.data.data);
        if (Array.isArray(res.data.data)) {
          setProgressItems(res.data.data);
        } else {
          console.warn('Unexpected API response:', res.data);
          setProgressItems([]);
        }
      } catch (error) {
        console.error('Error fetching progress goals:', error);
        setProgressItems([]);
      }
    };

    fetchGoals();
  }, []);

  const hasItems = progressItems.length > 0;
  const displayedItems = showAll
    ? progressItems
    : progressItems.slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-5 border-b border-indigo-200 dark:border-indigo-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Progress Tracker
            </h3>
          </div>
          <button
            onClick={() => navigate('/edit-progress')}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      <div className="p-5">
        {hasItems ? (
          <>
            <ul className="space-y-3">
              {displayedItems.map((item) => {
                const {
                  id,
                  title,
                  goalStatus
                } = item;
                return (
                  <li
                    key={id}
                    className="group flex justify-between items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow transition-all cursor-pointer"
                    onClick={() => navigate('/edit-progress')}
                  >
                    {/* Left Section: Status Dot + Title + Meta */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            goalStatus === 'pending'
                              ? 'bg-indigo-500'
                              : goalStatus === 'in-progress'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        ></span>
                        <span className="text-gray-800 dark:text-white font-semibold">
                          {title?.trim() || 'Untitled'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 ml-5">
                        {goalStatus.replace('-', ' ')}
                      </div>
                    </div>

                    {/* Right Arrow */}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
                  </li>
                );
              })}
            </ul>

            {progressItems.length > 4 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                >
                  {showAll ? 'Show less' : 'Read more...'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-indigo-400 dark:text-indigo-300" />
            </div>
            <h4 className="text-gray-600 dark:text-gray-300 font-medium mb-1">
              No progress items yet
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Start tracking your achievements and goals
            </p>
            <button
              onClick={() => navigate('/edit-progress')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Progress Item
            </button>
          </div>
        )}

        {hasItems && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total items
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                {progressItems.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
