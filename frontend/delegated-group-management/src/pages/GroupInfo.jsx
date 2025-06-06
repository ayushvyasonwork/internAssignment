import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GroupInfo = () => {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setError('You must be logged in.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/groups/${groupId}/members/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || 'Failed to fetch members');
        }

        const data = await response.json();
        setMembers(data); // assuming response is a list of member objects
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMembers();
  }, [groupId]);

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Group Info</h2>
      <p className="text-gray-600 mb-6">
        Showing details for group ID: <strong className="text-gray-800">{groupId}</strong>
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Group Members</h3>
        {members.length > 0 ? (
          <ul className="space-y-4">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow transition"
              >
                <div>
                  <p className="text-lg font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No members found.</p>
        )}
      </div>
    </div>
  );
};

export default GroupInfo;
