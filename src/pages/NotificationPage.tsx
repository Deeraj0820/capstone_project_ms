import React, {useEffect, useState} from "react";
import { deleteNotification, getAllNotifications, updateNotification } from "../utils/bookings.ts";

const notifications = [
  {
    id: 1,
    message: "Your booking for 'The Great Gatsby' has been confirmed.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    message: "Reminder: Your library book is due tomorrow.",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    message: "New group invitation: 'Book Lovers Club'.",
    timestamp: "1 day ago",
  },
];

const NotificationPage: React.FC = () => {
    const [notifications, setNotifications] = useState([])
    const fetchAllNotifications = async () =>{
        try{
            const resp = await getAllNotifications();
            setNotifications(resp)
            // console.log('resp',resp)
        }catch(err){
            console.log(err)
        }
    }
    
useEffect(()=>{
    fetchAllNotifications();
},[])

  const handleAccept = async (id: string) => {
    try{
        const resp = await updateNotification(id)
        console.log(resp)
        fetchAllNotifications();
    }catch(err){
        console.log(err)
    }
  };

  const handleClose = async (id: string) => {
    try{
        const resp = await deleteNotification(id)
        console.log(resp)
        fetchAllNotifications();
    }catch(err){
        console.log(err)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h1>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification?.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1">
                <p className="text-gray-700">Booking for "{notification?.bookName}" with SPN_NO: {notification?.SPN_NO
                } has been made by {notification?.userName}</p>
                <p className="text-sm text-gray-500 mt-1"> {new Date(notification?.timestamp).toLocaleString()}</p>
              </div>

              <div className="flex space-x-4">
                {/* Tick Icon (Accept) */}
                {!notification?.isRead &&
                <button
                  onClick={() => handleAccept(notification.id)}
                  className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
          }

                {/* Close Icon (Dismiss) */}
                <button
                  onClick={() => handleClose(notification.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;