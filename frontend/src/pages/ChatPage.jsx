import React, { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { socket } from '../App';

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export default function ChatPage() {
  const { state } = useLocation();
  const urlRequestId = state?.requestId;
  const urlChatId = state?.chatId;

  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [pendingRequest, setPendingRequest] = useState(null);
  const [error, setError] = useState(null);

  // Load userId
  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored) setUserId(Number(stored));
  }, []);

  // Fetch chats for user
  useEffect(() => {
    if (!userId) return;
    const fetchChats = async () => {
      try {
        const query = qs.stringify({
          filters: { users: { id: { $eq: userId } } },
          populate: { users: true, messages: { populate: 'sender', sort: ['createdAt:asc'] } },
        }, { encodeValuesOnly: true });
        const res = await axios.get(`${API_URL}/api/chats?${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });

        const items = Array.isArray(res.data.data) ? res.data.data : [];
        const normalized = items.map(raw => {
          const attrs = raw.attributes || {};
          const userData = attrs.users?.data;
          if (!Array.isArray(userData)) return null;
          const participants = userData.map(u => ({ id: u.id, username: u.attributes?.username || 'Unknown' }));
          const msgsData = Array.isArray(attrs.messages?.data) ? attrs.messages.data : [];
          const msgs = msgsData.map(m => ({
            id: m.id,
            senderId: m.attributes?.sender?.data?.id,
            content: m.attributes?.text || m.attributes?.content || '',
            username: m.attributes?.sender?.data?.attributes?.username || 'Unknown'
          }));
          return { id: raw.id, participants, messages: msgs, isTemporary: false };
        }).filter(Boolean);

        setChats(normalized);

        // If URL has chatId, set active chat and load its messages
        if (urlChatId) {
          const chatExists = normalized.find(c => c.id === urlChatId);
          if (chatExists) {
            setActiveChatId(urlChatId);
            setMessages(chatExists.messages);
          }
        }

      } catch (err) {
        console.error('[DEBUG] fetchChats error:', err);
        setError('Failed to fetch chats.');
      }
    };
    fetchChats();

    // Subscribe to new chat messages socket
    const msgKey = `chatMessage-${userId}`;
    const msgHandler = msg => {
      if (msg.chatId === activeChatId) setMessages(prev => [...prev, msg]);
    };
    socket.on(msgKey, msgHandler);
    return () => socket.off(msgKey, msgHandler);
  }, [userId, activeChatId, urlChatId]);

  // Handle incoming friend requests socket
  useEffect(() => {
    if (!userId) return;
    const key = `newFriendRequest-${userId}`;
    const handler = fr => {
      const pr = { id: fr.id, sender: fr.from };
      setPendingRequest(pr);
      const tempId = `temp-${pr.id}`;
      const tempChat = {
        id: tempId,
        participants: [
          { id: userId, username: localStorage.getItem('username') || 'You' },
          { id: pr.sender.id, username: pr.sender.username }
        ],
        messages: [],
        isTemporary: true
      };
      setChats(prev => {
        if (prev.some(c => c.id === tempId)) return prev;
        return [...prev, tempChat];
      });
      setActiveChatId(tempId);
      setMessages([]); // Clear messages for temp chat
    };
    socket.on(key, handler);
    return () => socket.off(key, handler);
  }, [userId]);

  // Handle initial URL requestId (friend request) - create temp chat
  useEffect(() => {
    if (!userId || !urlRequestId) return;

    const getRequest = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/friend-requests/${urlRequestId}?populate=sender`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        const raw = res.data.data || res.data;
        const senderRaw = raw.attributes?.sender?.data || raw.sender;
        if (!senderRaw || (!senderRaw.id && !senderRaw.username)) throw new Error('Invalid structure');
        const sender = {
          id: senderRaw.id,
          username: senderRaw.attributes?.username || senderRaw.username
        };
        const pr = { id: raw.id, sender };
        setPendingRequest(pr);
        const tempId = `temp-${pr.id}`;
        const tempChat = {
          id: tempId,
          participants: [
            { id: userId, username: localStorage.getItem('username') || 'You' },
            { id: sender.id, username: sender.username }
          ],
          messages: [],
          isTemporary: true
        };
        setChats(prev => {
          if (prev.some(c => c.id === tempId)) return prev;
          return [...prev, tempChat];
        });
        setActiveChatId(tempId);
        setMessages([]); // Clear messages for temp chat
      } catch (err) {
        console.error('[DEBUG] getRequest error:', err);
        setError('Failed to load friend request.');
      }
    };
    getRequest();
  }, [userId, urlRequestId]);

  // Load messages for active chat when it changes, if not temporary
  useEffect(() => {
    if (!userId || !activeChatId) return;

    // If temporary chat, no need to load messages
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat || chat.isTemporary) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chats/${activeChatId}?populate=messages.sender`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        const rawChat = res.data.data;
        if (!rawChat) return;
        const msgsData = rawChat.attributes?.messages?.data || [];
        const loadedMessages = msgsData.map(m => ({
          id: m.id,
          senderId: m.attributes?.sender?.data?.id,
          content: m.attributes?.text || m.attributes?.content || '',
          username: m.attributes?.sender?.data?.attributes?.username || 'Unknown'
        }));
        setMessages(loadedMessages);
      } catch (err) {
        console.error('[DEBUG] loadMessages error:', err);
        setError('Failed to load messages.');
      }
    };
    loadMessages();
  }, [activeChatId, userId, chats]);

  // UI handler to send message (you might already have it)
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChatId) return;
    try {
      await axios.post(`${API_URL}/api/chat-messages`, {
        data: {
          text: newMessage.trim(),
          chat: activeChatId,
          sender: userId
        }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      setNewMessage('');
      // Optimistically add message to UI
      setMessages(prev => [...prev, { id: `temp-${Date.now()}`, senderId: userId, content: newMessage.trim(), username: 'You' }]);
    } catch (err) {
      console.error('[DEBUG] sendMessage error:', err);
      setError('Failed to send message.');
    }
  };

  // UI - Render chat messages
  const renderMessages = () => {
    if (messages.length === 0) return <p>No messages yet.</p>;
    return messages.map(msg => (
      <div key={msg.id} className={msg.senderId === userId ? 'my-message' : 'other-message'}>
        <b>{msg.username}:</b> {msg.content}
      </div>
    ));
  };

  // UI - Render chat participant names
  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div>
      <h2>Chat Page</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!activeChat && <p>Select a chat or friend request to start.</p>}

      {activeChat && (
        <div>
          <h3>Chat with {activeChat.participants.filter(p => p.id !== userId).map(p => p.username).join(', ')}</h3>
          <div className="chat-window" style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
            {renderMessages()}
          </div>
          <div className="chat-input" style={{ marginTop: 10 }}>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Type your message..."
              style={{ width: '80%' }}
            />
            <button onClick={sendMessage} style={{ width: '18%', marginLeft: '2%' }}>Send</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h4>Your Chats</h4>
        <ul>
          {chats.map(c => (
            <li
              key={c.id}
              onClick={() => {
                setActiveChatId(c.id);
                if (!c.isTemporary) setMessages(c.messages);
                else setMessages([]);
                setPendingRequest(null);
              }}
              style={{ cursor: 'pointer', fontWeight: c.id === activeChatId ? 'bold' : 'normal' }}
            >
              Chat with {c.participants.filter(p => p.id !== userId).map(p => p.username).join(', ')} {c.isTemporary && '(Pending)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
