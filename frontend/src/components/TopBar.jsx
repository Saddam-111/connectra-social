import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ThemeButton from "./ThemeButton";

const TopBar = () => {
  const { notificationData } = useSelector((state) => state.user);
  const { darkMode } = useSelector((state) => state.theme); // ✅ subscribe to Redux
  const navigate = useNavigate();

  return (
    <div
      className={`flex lg:hidden items-center justify-between p-4 shadow-md 
      ${darkMode ? "bg-black text-blue-400" : "bg-white text-blue-600"} 
      fixed w-full z-50 transition-colors`}
    >
      <h1 className={`text-xl font-bold ${darkMode ? "text-amber-400" : "text-blue-600"}`}>Connectra</h1>

      <div className="flex items-center gap-4 text-2xl">
        {/* Theme Toggle */}
        <ThemeButton />

        {/* Notifications */}
        <div className="relative">
          <FaRegHeart
            onClick={() => navigate("/notification")}
            className="cursor-pointer hover:scale-110 transition-transform"
          />
          {notificationData?.some((noti) => !noti.isRead) && (
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 absolute top-0 right-0"></span>
          )}
        </div>

        {/* Messages */}
        <MdMessage
          onClick={() => navigate("/messages")}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
      </div>
    </div>
  );
};

export default TopBar;
