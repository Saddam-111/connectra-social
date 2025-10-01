import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoopCard from "../components/LoopCard";

const Loops = () => {
  const { loopData } = useSelector((state) => state.loop);
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-black flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-[500px] relative h-full">

        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full z-50 bg-black/80 border-b border-gray-700">
          <div className="max-w-[500px] mx-auto flex items-center gap-3 px-4 py-3 text-white">
            <FaArrowLeft
              className="text-xl cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-lg sm:text-xl font-semibold">Loops</h1>
          </div>
        </div>

        {/* Reels Scroll Container */}
        <div className="mt-[60px] h-[calc(100vh-60px)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {Array.isArray(loopData) && loopData.length > 0 ? (
            loopData.map((loop, index) => (
              <div
                key={index}
                className="snap-center h-[calc(100vh-60px)] flex items-center justify-center"
              >
                <LoopCard loop={loop} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-center px-4">
              No loops available.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Loops;
