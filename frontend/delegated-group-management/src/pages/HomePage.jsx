import React from 'react';
import { useNavigate } from 'react-router-dom';

const notifications = [
  "Approve add request of Ayush to group Finance",
  "Vikram made you executive member of group DevOps",
  "You were added to group Hackathon Squad",
  "Group Marketing changed its group description",
  "Meeting scheduled in group Team Rocket",
  "Priya removed you from group Freelancers",
  "New task added in group Project Phoenix",
  "Group Tech Innovators reached 100 members",
  "Reminder: Submit report in group Alpha Team",
  "Riya assigned you as admin of group Open Source Devs",
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100 p-4">

      {/* Sidebar: Notifications */}
     

      {/* Main Content: Buttons */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center space-y-6 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Group Manager</h1>

          <button
            onClick={() => navigate('/create-group')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create Group
          </button>

          <button
            onClick={() => navigate('/your-groups')}
            className="w-full px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Access All Your Groups
          </button>
          <button
            onClick={() => navigate('/join-group')}
            className="w-full px-6 py-3 bg-black text-white rounded hover:bg-green-700 transition"
          >
            Join/Add in a group
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
