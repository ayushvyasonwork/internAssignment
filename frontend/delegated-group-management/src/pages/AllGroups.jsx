import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AllGroups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to view your groups.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/groups/memberships/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch groups.');
      }

      setGroups(data); // Expecting data to be an array of group objects
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGroups(); // Fetch once initially

    const interval = setInterval(() => {
      fetchGroups();
    }, 100000); // Fetch every 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Groups</h2>

      {error && (
        <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Link
            key={group.id}
            to={`/group/${group.id}`}
            className="block border border-gray-300 rounded-xl p-5 bg-white hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {group.name}
            </h3>
            <p className="text-sm text-gray-600">Click to view group details</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllGroups;
