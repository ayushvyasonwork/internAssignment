import React from 'react';
import { Routes, Route, Navigate, Outlet , useLocation, useNavigate } from 'react-router-dom';
import { Toaster , toast } from 'react-hot-toast';

import NotificationBar from './components/NotificationBar';

import HomePage from './pages/HomePage';
import CreateGroup from './pages/CreateGroup';
import AllGroups from './pages/AllGroups';
import GroupInfo from './pages/GroupInfo';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import JoinGroup from './pages/JoinGroup';

// Check for auth token
const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};
const LogoutButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on login/signup pages
  const hideOnPaths = ['/login', '/signup'];
  if (hideOnPaths.includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 z-50"
    >
      Logout
    </button>
  );
};
// Route protection logic
const ProtectedRoute = () => {
  return isAuthenticated() ? (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-72 hidden md:block bg-white border-r shadow-sm">
        <NotificationBar />
      </aside>
      <main className="flex-grow p-4 md:p-6">
        {/* Toast container */}
        <Toaster position="top-right" />
              <LogoutButton />
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <>
      {/* Toast container for public pages */}
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/join-group" element={<JoinGroup />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/your-groups" element={<AllGroups />} />
          <Route path="/group/:groupId" element={<GroupInfo />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
