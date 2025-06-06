import React, { useState } from 'react';

const AssignUserToGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('access_token');

  const handleAssign = async () => {
    setMessage('');
    setError('');

    if (!groupName.trim() || !userEmail.trim()) {
      setError('Please enter both group name and user email.');
      return;
    }

    try {
      // Step 1: Get group ID by name
      const groupRes = await fetch(`http://localhost:8000/api/groups/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const groupData = await groupRes.json();
      const group = groupData.find((g) => g.name === groupName.trim());
      if (!group) throw new Error('Group not found');
      const groupId = group.id;

      // Step 2: Get user ID by email
      const userRes = await fetch(`http://localhost:8000/api/auth/all-users/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await userRes.json();
      const user = userData.find((u) => u.email === userEmail.trim());
      if (!user) throw new Error('User not found');
      const userId = user.id;

      // Step 3: Final API call (example - add user to group or assign role)
      const assignRes = await fetch(`http://localhost:8000/api/groups/${groupId}/join/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }), // or additional data as needed
      });
      if (!assignRes.ok) {
        const data = await assignRes.json();
        throw new Error(data.detail || 'Failed to assign user to group');
      }

      setMessage(assignRes.json().then(data => data.message || 'User assigned successfully'));
    } catch (err) {
      setError(err.message);
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
