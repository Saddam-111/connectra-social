import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineEye, AiFillDelete } from "react-icons/ai";
import VideoPlayer from "./VideoPlayer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setStoryList } from "../redux/storySlice";

const StoryCard = ({ story }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storyList } = useSelector((state) => state.story);
  const userData = useSelector((state) => state.user.userData);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true); // ✅ Controls visibility

  useEffect(() => {
    if (!story || !show) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 150);
    return () => clearInterval(interval);
  }, [story, show]);

  useEffect(() => {
    if (progress >= 100) navigate("/");
  }, [progress, navigate]);

  if (!story || !show)
    return <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await axios.delete(`${baseUrl}/api/story/delete/${story._id}`, { withCredentials: true });

      // Remove story from Redux store
      const updatedStories = storyList.filter((s) => s._id !== story._id);
      dispatch(setStoryList(updatedStories));

      // Hide story locally immediately
      setShow(false);
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const hasViewed = story.viewers?.some((v) => v._id === userData?.user?._id);

  return (
    <div className="relative w-full max-w-[300px] aspect-[9/16] bg-black rounded-xl flex flex-col overflow-hidden shadow-lg">
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-[5px] bg-gray-500 z-10">
        <div className="h-full bg-white transition-all duration-150 ease-linear" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 z-20">
        <div className="flex items-center gap-3">
          <BsArrowLeft size={24} className="text-white cursor-pointer" onClick={() => navigate(-1)} />
          <img src={story.author?.profileImage?.url} alt="profile" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
          <p className="text-white font-bold">{story.author?.userName}</p>
        </div>

        {story.author?._id === userData?.user?._id && (
          <AiFillDelete size={24} className="text-red-500 cursor-pointer" onClick={handleDelete} />
        )}
      </div>

      {/* Media */}
      <div className="flex-1 flex items-center justify-center p-2 cursor-pointer">
        {story.mediaType === "image" ? (
          <img src={story.media?.url} alt="Story" className="w-full h-full object-contain rounded-xl" />
        ) : (
          <VideoPlayer media={story.media?.url} />
        )}
      </div>

      {/* Viewers */}
      {story.author?._id === userData?.user?._id && story.viewers?.length > 0 && (
        <div className="w-full px-4 py-2 absolute bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white flex items-center gap-2">
          <AiOutlineEye size={20} />
          <p className="text-sm">
            <span className="font-semibold">{story.viewers.length}</span> viewers
          </p>
          <div className="flex">
            {story.viewers.slice(0, 3).map((v, i) => (
              <img key={i} src={v.profileImage?.url} alt={v.userName} className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCard;
