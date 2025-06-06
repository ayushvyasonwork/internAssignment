import React, { useState } from 'react';
import axios from '../api/axiosInstance';

const AssignUserToGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAssign = async () => {
    setMessage('');
    setError('');

    if (!groupName.trim() || !userEmail.trim()) {
      setError('Please enter both group name and user email.');
      return;
    }

    try {
      // Step 1: Get group by name
      const groupRes = await axios.get('/groups/');
      const group = groupRes.data.find(
        (g) => g.name.toLowerCase() === groupName.trim().toLowerCase()
      );
      if (!group) throw new Error('Group not found');
      const groupId = group.id;

      // Step 2: Get user by email
      const userRes = await axios.get('/auth/all-users/');
      const user = userRes.data.find(
        (u) => u.email.toLowerCase() === userEmail.trim().toLowerCase()
      );
      if (!user) throw new Error('User not found');
      const userId = user.id;

      // Step 3: Assign user to group
      const assignRes = await axios.post(`/groups/${groupId}/join/`, {
        user_id: userId,
      });

      setMessage(assignRes.data.message || 'User assigned successfully');
      setGroupName('');
      setUserEmail('');
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'Something went wrong';
      setError(errMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Assign User to Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />
      <input
        type="email"
        placeholder="User Email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleAssign}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Assign
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AssignUserToGroup;
