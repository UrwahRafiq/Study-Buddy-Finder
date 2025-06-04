// src/components/UnreadMessagesCard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { socket } from '../App';
import { Mail, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

const UnreadMessagesCard = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [acceptedNotifications, setAcceptedNotifications] = useState([]);
  const token = localStorage.getItem('jwt');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const friendRequestEvent = useMemo(
    () => `newFriendRequest-${userId}`,
    [userId]
  );

  const fetchPendingFriendRequests = async () => {
    if (!token || !userId) return;
    try {
      const query = qs.stringify(
        {
          filters: {
            receiver: { id: { $eq: userId } },
            status: { $eq: 'pending' }
          },
          populate: { sender: true },
          sort: ['createdAt:desc'],
        },
        { encodeValuesOnly: true }
      );

      const url = `${API_URL}/api/friend-requests?${query}`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const valid = data.data.map(r => {
        const sender = r.attributes?.sender?.data || r.sender;
        return {
          id: r.id,
          username: sender.attributes?.username || sender.username || 'Unknown',
        };
      });
      setFriendRequests(valid);

    } catch (error) {
      console.error('[UnreadMessagesCard] Error fetching pending requests:', error);
    }
  };

  useEffect(() => {
    fetchPendingFriendRequests();
  }, [token, userId]);

  // Incoming friend requests
  useEffect(() => {
    if (!userId) return;

    const handler = () => {
      fetchPendingFriendRequests();
    };

    socket.on(friendRequestEvent, handler);
    return () => {
      socket.off(friendRequestEvent, handler);
    };
  }, [friendRequestEvent, userId]);

   // [NEW] Listen for {accepted, declined} on my outgoing requests
 useEffect(() => {
   if (!userId) return;

   const responseHandler = data => {
     // data = { fromUsername, to, status, chatId }
     if (parseInt(data.to, 10) !== parseInt(userId, 10)) return;

     setAcceptedNotifications(prev => {
       // avoid duplicates by chatId + status
       if (prev.some(n => n.chatId === data.chatId && n.isSender)) return prev;
       return [
         ...prev,
         {
           chatId: data.chatId,
          username: data.fromUsername || 'Friend',
          isSender: true,
           status: data.status, // we can show “declined” vs. “accepted”
         }
       ];
     });
   };

   const namespaced = `friendRequestResponse-${userId}`;
   socket.on(namespaced, responseHandler);
   return () => {
     socket.off(namespaced, responseHandler);
   };
 }, [userId]);

  const openChat = (id, isChat = false) => {
    const state = isChat
      ? { chatId: id }
      : { requestId: id };
    navigate('/chat', { state });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-5 border-b border-indigo-200 dark:border-indigo-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Unread Messages
            </h3>
          </div>
          <button
            onClick={() => navigate('/friends')}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Accepted notifications */}
        {acceptedNotifications.map((note, idx) => (
          <div
            key={`acc-${note.chatId}-${idx}`}
            role="button"
            aria-label={`Open chat with ${note.username}`}
            tabIndex={0}
            onClick={() => openChat(note.chatId, true)}
            onKeyDown={e => e.key === 'Enter' && openChat(note.chatId, true)}
            className="group bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-md cursor-pointer transition-all mb-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-md font-semibold text-green-800 dark:text-green-200">
                  {note.username}
                </h4>
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  {note.isSender
                    ? note.status === 'accepted'
                      ? `${note.username} accepted your request!`
                      : `${note.username} declined your request.`
                    : /* (we no longer have a “receiver‐side accepted” here) */ ''}
                </p>
              </div>
              <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                  New
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Pending friend requests */}
        {friendRequests.length > 0 ? (
          <ul className="space-y-3">
            {friendRequests.map(req => (
              <li
                key={req.id}
                role="button"
                aria-label={`View friend request from ${req.username}`}
                tabIndex={0}
                onClick={() => openChat(req.id)}
                onKeyDown={e => e.key === 'Enter' && openChat(req.id)}
                className="group bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                      {req.username}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Wants to connect with you
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      New
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : acceptedNotifications.length === 0 ? (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-3">
              <Mail className="w-8 h-8 text-indigo-400 dark:text-indigo-300" />
            </div>
            <h4 className="text-gray-600 dark:text-gray-300 font-medium mb-1">
              No unread messages
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You'll see new messages here
            </p>
            <button
              onClick={() => navigate('/friends')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Find Friends
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UnreadMessagesCard;
