import React, { useEffect, useRef, useState } from "react";
import { BsVolumeMute, BsVolumeUp } from "react-icons/bs";
import FollowButton from "./FollowButton";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { MdCancel, MdOutlineComment } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoopData } from "../redux/loopSlice";
import moment from "moment";

const LoopCard = ({ loop }) => {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const loggedInUser = userData?.user;
  const { loopData } = useSelector((state) => state.loop);
  const { socket } = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const isLiked = loop.likes?.some((id) => id.toString() === loggedInUser?._id);

  // Toggle play/pause
  const handleClick = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Update progress
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video?.duration) setProgress((video.currentTime / video.duration) * 100);
  };

  // Like/unlike loop
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/loop/like/${loop._id}`,
        {},
        { withCredentials: true }
      );
      const updatedLoop = res.data.loop;
      dispatch(setLoopData(loopData.map(l => l._id === updatedLoop._id ? updatedLoop : l)));
    } catch (err) { console.log(err); }
  };

  // Comment on loop
  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
        `${baseUrl}/api/loop/comment/${loop._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedLoop = res.data.loop;
      dispatch(setLoopData(loopData.map(l => l._id === updatedLoop._id ? updatedLoop : l)));
      setMessage("");
    } catch (err) { console.log(err); }
  };

  // Double-tap to like
  const handleDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
    if (!isLiked) handleLike();
  };

  // Auto-play when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  // Listen for socket updates
  useEffect(() => {
    socket?.on("likedLoop", (data) => {
      dispatch(setLoopData(loopData.map(l => l._id === data.loopId ? { ...l, likes: data.likes } : l)));
    });
    socket?.on("commentedLoop", (data) => {
      dispatch(setLoopData(loopData.map(l => l._id === data.loopId ? { ...l, comments: data.comments } : l)));
    });

    return () => {
      socket?.off("likedLoop");
      socket?.off("commentedLoop");
    };
  }, [socket, loopData, dispatch]);

  if (!loop || !loop.author) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={loop?.media?.url}
        autoPlay
        loop
        muted={isMute}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover"
      />

      {/* Heart animation */}
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-6xl animate-ping">
          ❤️
        </div>
      )}

      {/* Mute button */}
      <div
        className="absolute top-5 right-4 bg-black/50 p-2 rounded-full z-10 cursor-pointer"
        onClick={() => setIsMute(prev => !prev)}
      >
        {isMute ? <BsVolumeMute className="text-white" /> : <BsVolumeUp className="text-white" />}
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-500/40">
        <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Bottom Info (Author + Caption) */}
      <div className="absolute bottom-16 left-5 text-white max-w-[80%]">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={loop.author?.profileImage?.url}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-bold">{loop.author.userName}</span>
          <FollowButton
            targetUserId={loop.author._id}
            tailwind="border px-3 py-1 rounded-md ml-2 cursor-pointer"
          />
        </div>
        <p className="text-sm break-words">{loop.caption}</p>
      </div>

      {/* Like & Comment Buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 text-white">
        <div className="flex flex-col items-center cursor-pointer" onClick={handleLike}>
          {isLiked ? <GoHeartFill className="text-red-500 w-8 h-8" /> : <GoHeart className="w-8 h-8" />}
          <span className="text-sm">{loop.likes?.length || 0}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowComment(true)}>
          <MdOutlineComment className="w-8 h-8" />
          <span className="text-sm">{loop.comments?.length || 0}</span>
        </div>
      </div>

      {/* Comment Panel */}
      {showComment && (
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-black/80 p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-white font-semibold">Comments</h2>
            <MdCancel className="text-white cursor-pointer" onClick={() => setShowComment(false)} />
          </div>

          {loop.comments.length === 0 && <p className="text-gray-300 text-center mt-4">No Comments Yet</p>}

          {loop.comments.map((comment, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <img
                src={comment.author?.profileImage?.url}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="bg-gray-800 text-white p-2 rounded-xl w-full">
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span className="font-semibold">{comment.author?.userName}</span>
                  <span>{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p className="text-sm">{comment.message}</p>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-1 rounded-full text-black"
            />
            <IoSendSharp className="text-white text-2xl cursor-pointer" onClick={handleComment} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoopCard;
