import { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsPage = () => {
  const [onlineStatus, setOnlineStatus] = useState('online');
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_STRAPI_URL}/api/users/${storedUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOnlineStatus(res.data.onlineStatus || 'online');
      } catch (err) {
        console.error('Failed to fetch user status:', err);
      }
    };

    if (storedUserId) fetchStatus();
  }, []);

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_STRAPI_URL}/api/users/${userId}`,
        { onlineStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOnlineStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };


  const getUserIdFromToken = () => {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    try {
      // JWT is three parts: header.payload.signature
      const base64Url = token.split('.')[1];
      // URL-safe base64 → base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // atob → percent-encoded → decodeURIComponent → JSON
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload).id;
    } catch {
      return null;
    }
  };

const deleteAccount = async () => {
  if (!window.confirm('Are you sure you want to delete your account?')) return;
  const token = localStorage.getItem('jwt');
  const userId = getUserIdFromToken();
  if (!userId) {
    console.error('No user ID in token!');
    return;
  }

  try {
    await axios.delete(
      `${import.meta.env.VITE_STRAPI_URL}/api/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.clear();
    window.location.href = '/';
  } catch (err) {
    console.error('Failed to delete account:', err);
  }
};

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_STRAPI_URL}/api/user/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="bg-indigo-600 p-6 text-white rounded-t-2xl shadow-md">
          <h1 className="text-2xl font-bold text-center">Account Settings</h1>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 space-y-6">
          {/* Status Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Status Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                <select
                  value={onlineStatus}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="online">Online</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Actions</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={logout}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
              >
                Logout
              </button>
              <button
                onClick={deleteAccount}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
