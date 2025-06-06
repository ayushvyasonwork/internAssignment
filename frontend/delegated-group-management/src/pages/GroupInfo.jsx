import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const GroupInfo = () => {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get(`/groups/${groupId}/members/`);
        const data = response.data;

        // Promote is_org_admin users to Owner if not already
        const updatedMembers = data.map((member) => {
          if (member.is_org_admin && member.role !== 'Owner') {
            return { ...member, role: 'Owner' };
          }
          return member;
        });

        setMembers(updatedMembers);

        const token = localStorage.getItem('access_token');
        const decoded = parseJwt(token);
        setCurrentUserId(decoded.user_id);

        const currentUser = updatedMembers.find((m) => m.id === decoded.user_id);
        if (currentUser) {
          setCurrentUserRole(currentUser.role);
        }
      } catch (err) {
        const errMsg = err.response?.data?.detail || err.message;
        setError(errMsg);
      }
    };

    fetchMembers();
  }, [groupId]);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  };

  const handleRemove = async (userId) => {
    try {
      await axiosInstance.delete(`/groups/${groupId}/remove-member/${userId}/`);
      setMembers((prev) => prev.filter((member) => member.id !== userId));
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  const canRemove = (targetRole, targetId) => {
    if (!['Admin', 'Owner'].includes(currentUserRole)) return false;
    if (currentUserId === targetId) return false;

    const priority = { Member: 1, Admin: 2, Owner: 3 };
    return priority[currentUserRole] > priority[targetRole];
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Group Info</h2>
      <p className="text-gray-600 mb-6">
        Showing details for group ID:{' '}
        <strong className="text-gray-800">{groupId}</strong>
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Group Members
        </h3>
        {members.length > 0 ? (
          <ul className="space-y-4">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow transition"
              >
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {member.role}
                  </span>

                  {canRemove(member.role, member.id) && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
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
