import React, { useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import NotificationCard from "../components/NotificationCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = ({ setShowNotification }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { notificationData } = useSelector((state) => state.user);
  const { darkMode } = useSelector((state) => state.theme); // ✅ dark mode
  const ids = notificationData.map((n) => n._id);
  const navigate = useNavigate();

  const markAsRead = async () => {
    try {
      await axios.post(
        `${baseUrl}/api/user/markAsRead`,
        { notificationId: ids },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    markAsRead();
  }, []);

  const handleBack = () => {
    if (setShowNotification) {
      setShowNotification(false); // desktop sidebar
    } else {
      navigate(-1); // mobile route
    }
  };

  return (
    <div
      className={`w-full flex flex-col h-full overflow-y-auto scrollbar-hide
        ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"}`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-2 px-4 py-3 border-b
          ${darkMode ? "border-gray-700" : "border-gray-300"}`}
      >
        <button className={`${darkMode ? "text-blue-400" : "text-blue-500"}`} onClick={handleBack}>
          <IoArrowBack size={24} />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold">Notifications</h2>
      </div>

      {/* Notifications List */}
      <div className="flex-1 px-3 sm:px-4 py-4 space-y-4">
        {notificationData?.length > 0 ? (
          notificationData.map((noti, index) => (
            <NotificationCard noti={noti} key={index} darkMode={darkMode} />
          ))
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-center mt-6`}>
            No notifications yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
