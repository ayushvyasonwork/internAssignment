import toast from 'react-hot-toast';
import React, { useEffect, useState, useRef } from 'react';
import { getUserIdFromToken } from '../utils/auth';
import axios from '../api/axiosInstance';
import { X } from 'lucide-react'; // You can use any icon lib or plain ❌
const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const wsUrl = `ws://localhost:8000/ws/notifications/${userId}/`;
    socketRef.current = new WebSocket(wsUrl);

   socketRef.current.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    const message = data.message;
    const newNotification = {
      id: `${message.title}-${message.message}-${message.user_id || ''}-${message.group_id || ''}`,
      text: `${message.title}: ${message.message}`,
      ...message,
    };

    // Check if already exists
    setNotifications((prev) => {
      const exists = prev.some((note) => note.id === newNotification.id);
      if (exists) return prev;
      return [newNotification, ...prev.slice(0, 19)];
    });

    toast.success(newNotification.text);
  } catch (e) {
    console.error('Invalid message:', e);
  }
};

    return () => {
      socketRef.current.onclose = (event) => {
  if (event.code !== 1000) {
    toast.error('WebSocket disconnected unexpectedly.');
  }
};
    };
  }, []);

  const handleApprove = async (groupId, userId, index) => {
  try {
    const res = await axios.post(`/groups/${groupId}/approve/${userId}/`);
    toast.success(res.data.message || 'User approved successfully');
    removeNotification(index);
  } catch (error) {
    const errMsg = error.response?.data?.detail || error.message;
    toast.error(errMsg);
  }
}
  const removeNotification = (indexToRemove) => {
    setNotifications((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <aside className="w-72 bg-white shadow-md border-r h-screen p-6 sticky top-0 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-3">
        {notifications.length === 0 ? (
          <li className="text-sm text-gray-500">No notifications</li>
        ) : (
          notifications.map((note, index) => (
            <li
              key={index}
              className="relative text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded shadow-sm pr-10"
            >
              {note.text}
              {note.action === 'approve_request' && (
                <button
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded ml-2 hover:bg-green-600"
                  onClick={() => handleApprove(note.group_id, note.user_id, index)}
                >
                  Approve
                </button>
              )}
              <button
                className="absolute top-1 right-2 text-gray-400 hover:text-red-600"
                onClick={() => removeNotification(index)}
              >
                ❌
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};


export default NotificationBar;
