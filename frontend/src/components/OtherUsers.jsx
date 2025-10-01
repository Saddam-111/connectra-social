import React from "react";
import { useSelector } from "react-redux";
import { images } from "../assets/asset";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";


const OtherUsers = () => {
  const { suggestedUsers, loading } = useSelector((state) => state.user);

  const users = suggestedUsers.users
  const navigate = useNavigate()
  if (loading) return <Loading />;

  return (
    <div className="flex flex-col gap-4 overflow-x-scroll scrollbar-hide">
      {users && users.length > 0 ? (
        users.slice(0, 4).map((otherUser) => (
          <div
            key={otherUser._id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${otherUser.userName}`)}>
              <img
                src={otherUser.profileImage?.url || images.profileImg}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-blue-400"
              />
              <div className="flex flex-col ">
                <span className="font-semibold text-gray-800 text-sm">{otherUser.name}</span>
                <span className="text-gray-500 text-xs">@{otherUser.userName}</span>
              </div>
            </div>
            <FollowButton targetUserId={otherUser._id} tailwind={`bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer`} />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No suggestions available</p>
      )}
    </div>
  );
};

export default OtherUsers;
