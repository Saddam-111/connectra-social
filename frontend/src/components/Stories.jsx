import axios from "axios";
import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Stories = ({ profileImage, userName, story, isCurrentUser }) => {
  const userData = useSelector((state) => state.user.userData);
  const { darkMode } = useSelector((state) => state.theme); // dark mode
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleViewers = async () => {
    if (!story) return;
    try {
      await axios.get(`${baseUrl}/api/story/view/${story._id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (!story && userName === "Your Story") {
      navigate("/upload");
    } else {
      handleViewers();
      navigate(`/story/${userName}`);
    }
  };

  const hasViewed = story?.viewers?.some(
    (viewer) => viewer._id === userData?.user?._id
  );

  // border color logic
  const borderColor = !story
    ? darkMode
      ? "border-gray-600"
      : "border-gray-300"
    : hasViewed
    ? darkMode
      ? "border-gray-500"
      : "border-gray-400"
    : "border-pink-500";

  return (
    <div className="flex flex-col items-center cursor-pointer snap-start mx-1">
      <div
        className={`relative w-16 h-16 rounded-full p-[2px] border-2 ${borderColor} transition-colors duration-300`}
        onClick={handleClick}
      >
        <img
          src={profileImage}
          alt={userName}
          className="w-full h-full object-cover rounded-full"
        />
        {!story && userName === "Your Story" && (
          <div className="absolute right-0 bottom-0 bg-white dark:bg-gray-700 rounded-full p-0.5">
            <FiPlusCircle
              size={22}
              className={darkMode ? "text-gray-200" : "text-black"}
            />
          </div>
        )}
      </div>

      <p
        className={`text-xs mt-1 text-center max-w-[60px] truncate 
          ${darkMode ? "text-gray-200" : "text-gray-800"}`}
      >
        {userName}
      </p>

      {userName === "Your Story" && story?.viewers?.length > 0 && (
        <p className="text-[10px] mt-0.5 text-center text-gray-500 dark:text-gray-400">
          {story.viewers.length} view{story.viewers.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default Stories;
