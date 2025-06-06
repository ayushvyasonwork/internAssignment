import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleCreateGroup = async () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    setError('You must be logged in to create a group.');
    return;
  }

  if (!groupName.trim()) {
    setError('Group name is required.');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/groups/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: groupName }),
    });

    const data = await response.json();
    console.log('Group created:', data);

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to create group');
    }

    // Redirect to /group/{id}
    navigate(`/group/${data.id}`);
  } catch (err) {
    setError(err.message);
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
