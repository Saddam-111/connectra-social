import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";
import { setPostData } from "../redux/postSlice";
import VideoPlayer from "./VideoPlayer";
import moment from "moment";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";
import RightSidebarComments from "./RightSideBarComments";
import BottomSheetComments from "./BottomSheetComments";
import { setUserData } from "../redux/userSlice";

const PostCard = ({ post }) => {
  const { socket } = useSelector((state) => state.socket);
  const navigate = useNavigate();
  const { userData, following } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { darkMode } = useSelector((state) => state.theme);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  const [showSidebar, setShowSidebar] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [commentText, setCommentText] = useState("");

  const loggedInUser = userData?.user;
  const isSmallScreen = window.innerWidth < 1280;

  // Check like, save, follow
  const isLiked = post.likes?.some((id) => id.toString() === loggedInUser?._id);
  const isSaved = loggedInUser?.saved?.some((id) => id.toString() === post._id);
  const isFollowing = (following || []).includes(post.author?._id);

  const handleLike = async () => {
    const updatedPosts = postData.map((p) => {
      if (p._id === post._id) {
        const alreadyLiked = p.likes.some(id => id.toString() === loggedInUser._id);
        return {
          ...p,
          likes: alreadyLiked
            ? p.likes.filter(id => id.toString() !== loggedInUser._id)
            : [...p.likes, loggedInUser._id]
        };
      }
      return p;
    });
    dispatch(setPostData(updatedPosts));

    try {
      await axios.post(`${baseUrl}/api/post/like/${post._id}`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleSave = async () => {
    const updatedUser = {
      ...userData.user,
      saved: isSaved
        ? userData.user.saved.filter(id => id.toString() !== post._id)
        : [...(userData.user.saved || []), post._id]
    };
    dispatch(setUserData({ ...userData, user: updatedUser }));

    try {
      await axios.post(`${baseUrl}/api/post/saved/${post._id}`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      _id: Date.now().toString(),
      user: loggedInUser,
      message: commentText,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = postData.map((p) =>
      p._id === post._id
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
    );
    dispatch(setPostData(updatedPosts));
    setCommentText("");

    try {
      await axios.post(
        `${baseUrl}/api/post/comment/${post._id}`,
        { message: newComment.message },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  // --- Socket listeners ---
  useEffect(() => {
    socket?.on("likedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setPostData(updatedPosts));
    });

    socket?.on("commentedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setPostData(updatedPosts));
    });

    return () => {
      socket?.off("likedPost");
      socket?.off("commentedPost");
    };
  }, [socket, postData, dispatch]);

  return (
    <>
      <div
        className={`w-full max-w-2xl flex flex-col rounded-2xl shadow-md mx-auto mt-5 mb-5 pb-4
          ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"} transition-colors duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full px-4 py-2 cursor-pointer">
          <div
            className="flex items-center gap-3"
            onClick={() => navigate(`/profile/${post.author.userName}`)}
          >
            <img
              src={post.author?.profileImage?.url}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col items-start">
              <div className="truncate font-bold text-md max-w-[150px]">
                {post.author?.userName}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {moment(post.createdAt).fromNow()}
              </p>
            </div>
          </div>
          {loggedInUser?._id !== post.author?._id && !isFollowing && (
            <FollowButton
              targetUserId={post.author?._id}
              tailwind="font-bold text-blue-500 rounded-full border-2 px-2 hover:bg-blue-500 hover:text-white cursor-pointer"
            />
          )}
        </div>

        {/* Media */}
        <div className="w-full flex items-center justify-center px-1 sm:px-3 md:px-4">
          {post.mediaType === "image" && (
            <img
              src={post.media?.url}
              alt="Post"
              className="w-full max-h-[400px] rounded-xl object-contain"
            />
          )}
          {post.mediaType === "video" && (
            <div className="w-full h-auto flex items-center justify-center rounded-xl overflow-hidden">
              <VideoPlayer media={post.media?.url} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w-full px-4 py-2 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <FaHeart
                  onClick={handleLike}
                  className={`text-2xl cursor-pointer transition-transform ${
                    isLiked ? "text-red-500 scale-110" : "text-gray-500 hover:text-red-500"
                  }`}
                />
                {post.likes?.length > 0 && (
                  <span className="font-semibold text-sm">
                    {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <MdOutlineComment
                  onClick={() => {
                    if (isSmallScreen) setShowBottomSheet(true);
                    else setShowSidebar(true);
                  }}
                  className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                />
                <span className="font-semibold text-sm">
                  {post.comments?.length} {post.comments?.length === 1 ? "comment" : "comments"}
                </span>
              </div>
            </div>

            <div onClick={handleSave} className="cursor-pointer">
              {isSaved ? (
                <BsBookmarkFill className="text-2xl text-blue-500" />
              ) : (
                <BsBookmark className="text-2xl text-gray-500 hover:text-blue-500" />
              )}
            </div>
          </div>

          {/* Comment Input */}
          <div className="flex items-center gap-2 w-full px-2">
            <img
              src={loggedInUser?.profileImage?.url}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className={`flex-1 px-3 py-1 rounded-full text-sm border focus:outline-none
                ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                          : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"}`}
            />
            <button
              onClick={handleComment}
              className="text-blue-500 hover:scale-125 transition-transform"
            >
              <IoSendSharp />
            </button>
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="w-full px-3 flex flex-wrap items-center gap-2 text-sm">
              <h1 className="font-bold">{post.author.userName}</h1>
              <p>{post.caption}</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      {showSidebar && !isSmallScreen && (
        <RightSidebarComments
          post={post}
          commentText={commentText}
          setCommentText={setCommentText}
          handleComment={handleComment}
          onClose={() => setShowSidebar(false)}
        />
      )}

      {/* Mobile/Tablet Bottom Sheet */}
      {showBottomSheet && isSmallScreen && (
        <BottomSheetComments
          post={post}
          onClose={() => setShowBottomSheet(false)}
        />
      )}
    </>
  );
};

export default PostCard;
