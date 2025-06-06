// src/components/Auth/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success('Logged out successfully!');
    navigate('/login');
  }, [navigate]);

  return null; // No UI needed, just redirect
};

export default Logout;
