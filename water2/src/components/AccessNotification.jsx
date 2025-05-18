import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const AccessNotification = () => {
  const { user } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !user.isDoctor) return;
      
      try {
        setLoading(true);
        // This would be a new endpoint you'd need to create
        const response = await axios.get('http://localhost:4000/api/doctor/access-notifications');
        
        if (response.data.success) {
          setNotifications(response.data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isDoctor) {
      fetchNotifications();
      
      // Set up polling to check for new notifications
      const interval = setInterval(fetchNotifications, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      // This would be a new endpoint you'd need to create
      await axios.post(`http://localhost:4000/api/doctor/mark-notification-read/${notificationId}`);
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (!user || !user.isDoctor || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
        <h3 className="text-lg font-semibold mb-2">Access Notifications</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
            >
              <p className="text-sm">
                <span className="font-medium">{notification.patientName}</span> 
                {notification.type === 'grant' 
                  ? ' has granted you access to their medical data.' 
                  : ' has revoked your access to their medical data.'}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(notification.date).toLocaleString()}
                </span>
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification._id)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessNotification;