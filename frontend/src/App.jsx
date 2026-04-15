import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SinglePlayer from './pages/SinglePlayer';
import ArenaLobby from './pages/ArenaLobby';
import PrivateLobby from './pages/PrivateLobby';
import GameArena from './pages/GameArena';
import Profile from './pages/Profile';
import Social from './pages/Social';
import Leaderboard from './pages/Leaderboard';
import WorldChat from './pages/WorldChat';
import PublicProfile from './pages/PublicProfile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#131314] text-primary">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#131314] text-on-surface flex flex-col font-body selection:bg-primary-container selection:text-on-primary-container">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/single-player" element={<ProtectedRoute><SinglePlayer /></ProtectedRoute>} />
              <Route path="/arena" element={<ProtectedRoute><ArenaLobby /></ProtectedRoute>} />
              <Route path="/private-lobby/:lobbyId" element={<ProtectedRoute><PrivateLobby /></ProtectedRoute>} />
              <Route path="/game-room/:gameId" element={<ProtectedRoute><GameArena /></ProtectedRoute>} />
              <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/world-chat" element={<ProtectedRoute><WorldChat /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/:username" element={<PublicProfile />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <Footer />
        </div>
        <Analytics />
      </Router>
    </AuthProvider>
  );
}

export default App;
