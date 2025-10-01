import React from "react";
import { IoClose } from "react-icons/io5";
import moment from "moment";

const BottomSheetComments = ({ post, onClose }) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-[80%] bg-white border-2 border-gray-400 z-50 animate-slide-up rounded-t-2xl shadow-lg overflow-y-scroll scrollbar-hide">
  {/* Sticky Header */}
  <div className="sticky top-0 bg-neutral-100 z-10 flex justify-between items-center px-4 py-3 border-b">
    <h2 className="text-lg font-semibold">All Comments</h2>
    <button onClick={onClose}>
      <IoClose size={24} />
    </button>
  </div>

      {/* Comment List */}
      <div className="overflow-y-auto h-[calc(100%-48px)] space-y-4 pr-2 pt-2 scrollbar-hide">
        {post.comments?.map((comment, idx) => (
          <div key={idx} className="flex pl-2 gap-2 items-start">
            <img
              src={comment.author?.profileImage?.url}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="bg-gray-300 p-2 rounded-xl w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span className="font-semibold">{comment.author?.userName}</span>
                <span>{moment(comment.createdAt).fromNow()}</span>
              </div>
              <p className="text-sm">{comment.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomSheetComments;
