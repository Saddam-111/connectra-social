import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setProfileData } from "../redux/userSlice";
import { setSelectedUser } from "../redux/messageSlice";
import axios from "axios";
import { IoArrowBack, IoGridSharp, IoBookmarkOutline } from "react-icons/io5";
import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";

const Profile = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts"); // posts | saved

  const { profileData, userData, darkMode } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);

  const loggedInUser = userData?.user;
  const profileUser = profileData?.user;
  const isOwnProfile = profileUser?._id === loggedInUser?._id;

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await axios.get(`${baseUrl}/api/user/getProfile/${userName}`, {
          withCredentials: true,
        });
        dispatch(setProfileData(result.data));
      } catch (error) {
        console.error("API error:", error.response?.data || error.message);
      }
    };

    if (userName) fetchProfile();
  }, [userName, dispatch]);

  if (!profileUser) return null;

  // Filtered posts based on active tab
  const filteredPosts =
    activeTab === "posts"
      ? postData.filter((post) => post.author?._id === profileUser?._id)
      : postData.filter((post) => loggedInUser?.saved?.includes(post._id));

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 shadow-sm sticky top-0 z-10 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} className={`${darkMode ? "text-blue-400" : "text-blue-500"}`} />
          <h2 className={`${darkMode ? "text-blue-400" : "text-blue-500"} font-semibold text-lg`}>Back</h2>
        </div>
        <h2 className="text-lg font-bold">@{profileUser?.userName}</h2>
        {isOwnProfile ? (
          <button
            onClick={handleLogout}
            className={`${darkMode ? "text-red-400" : "text-red-500"} font-semibold`}
          >
            Logout
          </button>
        ) : (
          <div className="w-20" />
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center px-4 py-6">
        <img
          src={profileUser?.profileImage?.url || "/default-profile.png"}
          alt="Profile"
          className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300"
        />
        <h2 className="text-xl font-bold mt-3">{profileUser?.name}</h2>
        <p className="text-sm text-gray-500">@{profileUser?.userName}</p>
        {profileUser?.profession && <p className="text-sm text-gray-600 mt-1">{profileUser.profession}</p>}
        {profileUser?.bio && <p className="text-sm text-gray-600 text-center mt-1 px-4">{profileUser.bio}</p>}

        {/* Stats */}
        <div className="flex justify-around w-full max-w-sm mt-6 text-center">
          <div>
            <p className="font-semibold">{profileUser?.posts?.length || 0}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-semibold">{profileUser?.followers?.length || 0}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{profileUser?.following?.length || 0}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {isOwnProfile ? (
            <button
              onClick={() => navigate("/edit-profile")}
              className={`px-4 py-1 text-sm border rounded-md transition w-36 sm:w-40 ${
                darkMode ? "border-gray-600 hover:bg-gray-800" : "border-gray-400 hover:bg-gray-100"
              }`}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <FollowButton
                targetUserId={profileUser?._id}
                tailwind={`px-4 py-1 text-sm border rounded-md transition w-32 sm:w-36 cursor-pointer ${
                  darkMode ? "border-gray-600 hover:bg-gray-800" : "border-gray-400 hover:bg-gray-100"
                }`}
              />
              <button
                onClick={() => {
                  dispatch(setSelectedUser(profileData));
                  navigate("/messageArea");
                }}
                className={`px-4 py-1 text-sm border rounded-md transition w-32 sm:w-36 cursor-pointer ${
                  darkMode ? "border-gray-600 hover:bg-gray-800" : "border-gray-400 hover:bg-gray-100"
                }`}
              >
                Message
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-t flex justify-center md:justify-start gap-8 mt-4 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
        <div
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-1 cursor-pointer py-2 ${
            activeTab === "posts" ? "border-t-2 border-blue-500 font-semibold" : "text-gray-500"
          }`}
        >
          <IoGridSharp className="w-5 h-5" /> Posts
        </div>
        {isOwnProfile && (
          <div
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-1 cursor-pointer py-2 ${
              activeTab === "saved" ? "border-t-2 border-blue-500 font-semibold" : "text-gray-500"
            }`}
          >
            <IoBookmarkOutline className="w-5 h-5" /> Saved
          </div>
        )}
      </div>

      {/* Posts / Saved Grid */}
      <div className="px-2 sm:px-4 pb-24 mt-2">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => <PostCard post={post} key={index} />)
          ) : (
            <p className="text-center text-gray-500 mt-8">
              {activeTab === "posts" ? "No posts to display" : "No saved posts"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
