import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    setError('');

    if (!groupName.trim()) {
      setError('Group name is required.');
      return;
    }

    try {
      const response = await axiosInstance.post('/groups/', {
        name: groupName,
      });

      console.log('Group created:', response.data);

      // Redirect to /group/{id}
      navigate(`/group/${response.data.id}`);
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to create group';
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center space-y-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800">Create a New Group</h2>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleCreateGroup}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
