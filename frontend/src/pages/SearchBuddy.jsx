import React, { useState } from 'react';
import { Search, ChevronRight, Frown } from 'lucide-react';
import axios from 'axios';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { socket } from '../App'; // Assuming socket is exported from App

const API_URL = 'http://localhost:1337';

const SearchBuddy = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const queryString = qs.stringify({
        filters: {
          $or: [
            { username: { $containsi: query } },
            { fullName: { $containsi: query } },
            { university: { $containsi: query } },
            { degree: { $containsi: query } },
            { courses: { $containsi: query } },
            { interests: { $containsi: query } },
          ],
        },
        populate: ['profilePicture'],
      }, { encodeValuesOnly: true });

      const url = `http://localhost:1337/api/users?${queryString}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      setResults(response.data || []);
    } catch (error) {
      console.error('Error searching buddies:', error);
      setResults([]);
    }

    setHasSearched(true);
  };

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
      alert('Failed to send friend request.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-5 border-b border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Find Study Buddies</h2>
            </div>
          </div>
          <div className="p-5">
            <p className="text-gray-600 mb-4">
              Search for study partners by name, course, or shared interests
            </p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search by name, course, or interest"
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {hasSearched && results.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <Frown className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">Try different search terms or broaden your criteria</p>
            </div>
          ) : (
            results.map((user) => {
              const {
                id,
                username,
                fullName,
                university,
                degree,
                interests,
                profilePicture,
              } = user;

              const imageUrl =
                profilePicture?.url ||
                profilePicture?.data?.attributes?.url ||
                '/default-profile.jpeg';

              return (
                <div key={id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="p-5 flex items-start gap-4">
                    <img
                      src={profilePicture?.url 
                            ? `http://localhost:1337${profilePicture.url}` 
                            : profilePicture?.data?.attributes?.url 
                              ? `http://localhost:1337${profilePicture.data.attributes.url}` 
                              : '/default-profile.jpeg'}
                      alt={username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">{fullName || username}</h3>
                        <button
                          onClick={() => navigate(`/profile/${username.toLowerCase()}`)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                        >
                          View Profile <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{university || 'University not set'}</p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">
                          Degree: <span className="font-normal">{degree || 'N/A'}</span>
                        </p>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          Interests: <span className="font-normal">{Array.isArray(interests) ? interests.join(', ') : 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-end">
                    <button
                      onClick={() => sendFriendRequest(id)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Send Friend Request
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBuddy;
