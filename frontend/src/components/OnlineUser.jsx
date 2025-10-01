import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/messageSlice';

const OnlineUser = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center w-[60px] sm:w-[70px] cursor-pointer">
      <div
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-blue-400 overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
        onClick={() => {
          dispatch(setSelectedUser(user));
          navigate(`/messageArea`);
        }}
      >
        <img
          src={user.profileImage.url}
          alt="profile"
          className="w-full h-full object-cover"
        />
        {/* Online Indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      <p className="text-xs sm:text-sm text-center truncate w-full mt-1">
        @{user.userName}
      </p>
    </div>
  );
};

export default OnlineUser;
