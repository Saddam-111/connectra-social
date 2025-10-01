import React from "react";
import moment from "moment";

const NotificationCard = ({ noti, darkMode }) => {
  return (
    <div
      className={`w-full flex items-center justify-between transition rounded-xl p-3 md:p-4 shadow-sm
        ${darkMode 
          ? "bg-gray-800 hover:bg-gray-700 text-gray-200" 
          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
        }`}
    >
      {/* Left Side */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Profile Image */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border rounded-full overflow-hidden flex-shrink-0
          ${darkMode ? "border-gray-600" : "border-gray-400"}`}>
          <img
            src={noti.sender?.profileImage?.url}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Info */}
        <div className="flex flex-col text-xs sm:text-sm md:text-base">
          <h1 className="font-semibold">{noti.sender?.userName}</h1>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-[11px] sm:text-xs md:text-sm`}>
            {noti.message}
          </p>
          <span className={`${darkMode ? "text-gray-400" : "text-gray-900"} text-[10px] sm:text-xs md:text-sm`}>
            {moment(noti.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* Right Side Media */}
      {noti.post && (
        <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
          {noti.post.mediaType === "image" ? (
            <img
              src={noti.post.media.url}
              alt="post"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={noti.post.media.url}
              muted
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
