import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import EditProgress from './pages/EditProgress';
import EditEventsPage from './pages/EditEventsPage';
import BlogPostManager from './pages/BlogPostManager';
import MatchBuddy from './pages/MatchBuddy';
import SearchBuddy from './pages/SearchBuddy';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';

// Point at your standalone socket server
export const socket = io('http://localhost:4000');

function App() {
  useEffect(() => {
  const token = localStorage.getItem('jwt');
  const userId = localStorage.getItem('userId');

  if (token && userId) {
    socket.emit('join', userId);
  }

  const friendRequestResponseHandler = ({ fromUsername, status }) => {
    console.log('friendRequestResponse event received:', { fromUsername, status }); // debug log
    if (status === 'accepted') {
      alert(`${fromUsername || 'Someone'} accepted your friend request`);
    }
  };

  const onConnect = () => {
    console.log('[✅] Connected to socket:', socket.id);
    if (token && userId) {
      console.log(`[📤] Emitting join for user: ${userId}`);
      socket.emit('join', userId);

      socket.on(`friendRequestResponse-${userId}`, friendRequestResponseHandler);
    }
  };

  const onConnectError = (err) => {
    console.error('[❌] Socket.IO connection error:', err.message);
  };

  socket.on('connect', onConnect);
  socket.on('connect_error', onConnectError);

  return () => {
    socket.off('connect', onConnect);
    socket.off('connect_error', onConnectError);
    socket.off(`friendRequestResponse-${userId}`, friendRequestResponseHandler);
  };
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-progress"
          element={
            <PrivateRoute>
              <EditProgress />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-events"
          element={
            <PrivateRoute>
              <EditEventsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-posts"
          element={
            <PrivateRoute>
              <BlogPostManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/match-buddy"
          element={
            <PrivateRoute>
              <ErrorBoundary>
                <MatchBuddy />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/search-buddy"
          element={
            <PrivateRoute>
              <ErrorBoundary>
                <SearchBuddy />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <ErrorBoundary>
                <SettingsPage />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
