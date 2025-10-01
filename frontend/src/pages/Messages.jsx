import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUser from "../components/OnlineUser";
import { setSelectedUser } from "../redux/messageSlice";

const Messages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { darkMode } = useSelector((state) => state.theme); // ✅ dark mode
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers } = useSelector((state) => state.message);
  const { followingList } = useSelector((state) => state.user);

  const onlineUserIds = onlineUsers?.map(u => typeof u === "string" ? u : u.userId) || [];

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
    navigate("/messageArea");
  };

  return (
    <div
      className={`w-full min-h-screen p-3 sm:p-5 flex flex-col gap-5
        ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 sm:mb-5">
        <button
          className={`lg:hidden ${darkMode ? "text-blue-400" : "text-blue-500"}`}
          onClick={() => navigate(-1)}
        >
          <IoArrowBack size={24} />
        </button>
        <h2 className="text-2xl sm:text-xl font-bold">Messages</h2>
      </div>

      {/* Online Users / Following */}
      <div
        className={`flex overflow-x-auto gap-3 sm:gap-5 py-2 
          ${darkMode ? "border-b border-gray-700" : "border-b-2 border-gray-200"}`}
      >
        {followingList?.map(user =>
          onlineUserIds.includes(user._id) && (
            <OnlineUser key={user._id} user={user} darkMode={darkMode} />
          )
        )}
      </div>

      {/* Previous Chat Users */}
      <div className="flex-1 overflow-auto divide-y transition-colors"
           style={{borderColor: darkMode ? "#374151" : "#e5e7eb"}}>
        {prevChatUsers?.previousUser?.length > 0 ? (
          prevChatUsers.previousUser.map((user, index) => (
            <div
              key={user._id || index}
              className={`flex items-center gap-3 sm:gap-4 p-3 cursor-pointer transition 
                ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => handleSelectUser(user)}
            >
              {/* Profile Image */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={user.profileImage?.url}
                  alt={user.userName}
                  className="w-full h-full object-cover"
                />
                {onlineUserIds.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col truncate">
                <span className="font-medium truncate">{user.name || user.userName}</span>
                {onlineUserIds.includes(user._id) && (
                  <span className="text-green-500 text-xs">Active Now</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-10">No previous chats</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
