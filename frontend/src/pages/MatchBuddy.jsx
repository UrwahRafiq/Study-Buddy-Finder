import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { socket } from '../App';

const API_URL = 'http://localhost:1337';

const MatchBuddy = () => {
  const [loading, setLoading] = useState(true);
  const [buddies, setBuddies] = useState([]);
  const navigate = useNavigate();

  // Fetch matches from API and cache them
  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/match-buddies`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });
      const matches = response.data?.data?.matches || [];
      setBuddies(matches);
      localStorage.setItem('matchBuddies', JSON.stringify(matches));
      localStorage.setItem('matchBuddiesTimestamp', new Date().getTime());
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('jwt');
        navigate('/login');
      } else {
        console.error('Error fetching matches', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // On mount, load from cache or fetch
  useEffect(() => {
    const cachedData = localStorage.getItem('matchBuddies');
    const cacheTime = localStorage.getItem('matchBuddiesTimestamp');
    const now = new Date().getTime();

    if (cachedData && cacheTime && now - cacheTime < 3600000) { // 1 hour cache
      setBuddies(JSON.parse(cachedData));
      setLoading(false);
    } else {
      fetchMatches();
    }
  }, [navigate]);

  const sendFriendRequest = async (receiverId) => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      alert('You must be logged in to send a friend request.');
      return;
    }
    const currentUserId = Number(localStorage.getItem('userId'));

    try {
      await axios.post(
        `${API_URL}/api/friend-requests`,
        { data: { receiver: receiverId } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit('newFriendRequest', { 
        to: receiverId, 
        from: currentUserId,
      });
      
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error.response || error);
      if (error.response?.data?.error?.message) {
        alert(`Failed: ${error.response.data.error.message}`);
      } else {
        alert('Failed to send friend request.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Finding Your Perfect Matches</h3>
          <p className="text-gray-600">We're analyzing your profile to connect you with ideal study partners</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-5 border-b border-indigo-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Matched Study Buddies</h2>
              </div>
              <button
                onClick={() => { setLoading(true); fetchMatches(); }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
          <div className="p-5">
            <p className="text-gray-600">These students match your courses and learning preferences</p>
          </div>
        </div>

        {/* Buddies List */}
        <div className="space-y-4">
          {buddies.length > 0 ? (
            buddies.map((buddy) => (
              <div
                key={buddy.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-5 flex items-start gap-4">
                  <img
                    src="/default-profile.jpeg"
                    alt={buddy.username || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{buddy.username || 'Unnamed User'}</p>
                    <p className="text-gray-600 text-sm mt-1">{buddy.university || 'Unknown University'}</p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">
                        Shared Courses:{' '}
                        <span className="font-normal">
                          {buddy.sharedCourses?.join(', ') || 'N/A'}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        Common Interests:{' '}
                        <span className="font-normal">
                          {buddy.sharedInterests?.join(', ') || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => sendFriendRequest(buddy.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Send Friend Request
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your preferences or search manually</p>
              <button
                onClick={() => navigate('/search-buddy')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Search className="w-4 h-4" />
                Search Manually
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchBuddy;
