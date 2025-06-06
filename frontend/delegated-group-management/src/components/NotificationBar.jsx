import toast from 'react-hot-toast';
import React, { useEffect, useState, useRef } from 'react';
import { getUserIdFromToken } from '../utils/auth';
import { X } from 'lucide-react'; // You can use any icon lib or plain ❌

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const wsUrl = `ws://localhost:8000/ws/notifications/${userId}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('🔌 WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('new notification is ', data);
        const newNotification = `${data.message.title}: ${data.message.message}`;
        toast.success(newNotification);
        setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]);
      } catch (e) {
        console.error('Invalid WebSocket message', e);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.warn('WebSocket disconnected');
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

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
              {note}
              <button
                className="absolute top-1 right-2 text-gray-400 hover:text-red-600"
                onClick={() => removeNotification(index)}
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default NotificationBar;
