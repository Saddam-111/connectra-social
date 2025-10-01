import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFollow } from '../redux/userSlice';

const FollowButton = ({ targetUserId, tailwind = "" }) => {
  const dispatch = useDispatch();
  const following = useSelector(state => state.user.userData?.user?.following || []);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!targetUserId) return null;

  const isFollowing = following.includes(targetUserId);

  const handleFollow = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/user/follow/${targetUserId}`,
        { withCredentials: true }
      );
      console.log("✅ Follow API success:", response.data);
      dispatch(toggleFollow(targetUserId));
    } catch (error) {
      console.error("❌ Follow API error:", error?.response?.data || error.message);
    }
  };

  return (
    <button className={tailwind} onClick={handleFollow}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
