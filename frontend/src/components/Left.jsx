import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import OtherUsers from "./OtherUsers";
import Notifications from "../pages/Notifications";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Left = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  const { userData, notificationData } = useSelector((state) => state.user);
  const { darkMode } = useSelector((state) => state.theme); // ✅ subscribe to Redux

  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/api/auth/signout`, null, {
        withCredentials: true,
      });
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!userData) return null;

  return (
    <div
      className={`hidden lg:flex flex-col w-[20%] min-h-screen border-r px-4 py-6 
      ${darkMode ? "bg-black border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"} 
      ${showNotification ? "overflow-auto scrollbar-hide" : "overflow-hidden"} 
      transition-colors`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className={`text-3xl font-bold  ${darkMode ? "text-amber-400" : "text-blue-600"}`}>Connectra</h1>
        <div className="flex items-center gap-4 relative">
          <ThemeButton />

          <div className="relative">
            <FaRegHeart
              onClick={() => setShowNotification(true)}
              className="text-3xl text-blue-600 cursor-pointer"
            />
            {notificationData?.some((noti) => !noti.isRead) && (
              <div className="w-[10px] h-[10px] rounded-full bg-red-600 absolute top-1 right-0"></div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!showNotification && (
        <>
          <div
            className="flex items-center gap-4 mb-6 cursor-pointer"
            onClick={() => navigate(`/profile/${userData.user.userName}`)}
          >
            <img
              src={userData.user?.profileImage?.url}
              alt="User"
              className="w-14 h-14 rounded-full object-cover border border-blue-500"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold">{userData.user?.name}</span>
              <span className="text-sm">@{userData.user?.userName}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm mb-6 cursor-pointer"
          >
            Log out
          </button>

          <div className="flex-1 overflow-y-auto">
            <h2 className="font-semibold text-sm mb-3">Suggested for you</h2>
            <OtherUsers />
          </div>
        </>
      )}

      {showNotification && (
        <Notifications setShowNotification={setShowNotification} />
      )}
    </div>
  );
};

export default Left;
