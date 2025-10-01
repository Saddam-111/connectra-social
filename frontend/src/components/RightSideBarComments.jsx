import React from "react";
import { IoClose } from "react-icons/io5";
import moment from "moment";

const RightSidebarComments = ({ post, onClose }) => {
  return (
    <div className="fixed right-10 top-10 h-[500px] w-[25%] bg-white shadow-2xl shadow-[#00000090] rounded-2xl z-50 p-4 overflow-y-auto border-l">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        <button onClick={onClose}>
          <IoClose size={28} className=" rounded-full" />
        </button>
      </div>
      {post.comments?.map((comment, idx) => (
        <div key={idx} className="mb-4 flex gap-2 items-start">
          <img
            src={comment.author?.profileImage?.url}
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="bg-gray-100 p-2 rounded-lg flex-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="font-semibold">{comment.author?.userName}</span>
              <span>{moment(comment.createdAt).fromNow()}</span>
            </div>
            <p className="text-sm">{comment.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightSidebarComments;
