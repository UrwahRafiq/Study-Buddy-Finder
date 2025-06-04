import { useState, useEffect } from 'react';
import axios from 'axios';

function FriendRequestPage() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('jwt');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await axios.get(`${import.meta.env.VITE_STRAPI_URL}/api/users/${userId}?populate=receivedFriendRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.receivedFriendRequests);
    };
    fetchRequests();
  }, []);

  const acceptRequest = async (senderId) => {
    await axios.put(`${import.meta.env.VITE_STRAPI_URL}/api/users/${userId}`, {
      friends: { connect: [senderId] },
      receivedFriendRequests: { disconnect: [senderId] },
    }, { headers: { Authorization: `Bearer ${token}` } });

    await axios.put(`${import.meta.env.VITE_STRAPI_URL}/api/users/${senderId}`, {
      friends: { connect: [userId] },
      sentFriendRequests: { disconnect: [userId] },
    }, { headers: { Authorization: `Bearer ${token}` } });

    setRequests((prev) => prev.filter((r) => r.id !== senderId));
  };

  return (
    <div>
      <h2>Incoming Friend Requests</h2>
      {requests.map((req) => (
        <div key={req.id}>
          {req.username}
          <button onClick={() => acceptRequest(req.id)}>Accept</button>
        </div>
      ))}
    </div>
  );
}

export default FriendRequestPage;
