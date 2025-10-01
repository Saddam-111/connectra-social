import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Stories from "./Stories";
import PostCard from "./PostCard";
import Navbar from "./Navbar";
import { setStoryList } from "../redux/storySlice";
import axios from "axios";

const Feed = () => {
  const dispatch = useDispatch();
  const { postData } = useSelector(state => state.post);
  const userData = useSelector(state => state.user.userData?.user);
  const storyList = useSelector(state => state.story.storyList) || [];
  const { darkMode } = useSelector(state => state.theme); // ✅ subscribe to theme
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchStories = async () => {
    if (!userData?._id) return;
    try {
      const res = await axios.get(`${baseUrl}/api/story/getAll`, {
        withCredentials: true,
      });
      dispatch(setStoryList(Array.isArray(res.data.stories) ? res.data.stories : []));
    } catch (err) {
      console.log("Error fetching stories:", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [userData]);

  return (
    <div
      className={`flex flex-col min-h-screen pb-28 px-4 gap-4 relative
        ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"} 
        transition-colors duration-300`}
    >
      {/* Stories Section */}
      <div className="pt-2 flex flex-row overflow-x-auto scrollbar-hide items-center space-x-3">
        {/* Current user story */}
        {userData && (
          <Stories
            userName="Your Story"
            profileImage={userData.profileImage?.url}
            story={userData.story}
            isCurrentUser
          />
        )}

        {/* All other stories */}
        {Array.isArray(storyList) &&
          storyList.map((story, index) => (
            <Stories
              key={index}
              userName={story.author?.userName}
              profileImage={story.author?.profileImage?.url}
              story={story}
            />
          ))}
      </div>

      {/* Posts Section */}
      <div className="flex flex-col gap-6">
        {postData?.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}
      </div>

      {/* Fixed Bottom Navbar */}
      <div
        className={`fixed bottom-0 left-0 w-full z-30 border-t
          ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="max-w-md mx-auto px-4 py-2">
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default Feed;
