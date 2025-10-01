import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaUsers, FaImage, FaComments } from "react-icons/fa";
import { images } from "../assets/asset";

const Template = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-between bg-gradient-to-br from-blue-50 to-white px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
      
      {/* Left Content */}
      <div className="flex-1 flex flex-col items-center lg:items-start justify-center text-center lg:text-left space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaHeart 
            size={40} 
            className="text-blue-600 animate-pulse sm:size-[70px]" 
          />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-600 drop-shadow-md">
            Connectra
          </h1>
        </div>

        <p className="text-gray-700 text-base sm:text-lg max-w-sm sm:max-w-md leading-relaxed">
          <strong className="text-blue-500">Connectra</strong> is your gateway to a vibrant digital community.
          Meet new people, share your stories, and be part of a social world that values connection, creativity and authenticity.
        </p>

        {/* Tagline / Quote */}
        <p className="italic text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm">
          “Real connections in a digital world.”
        </p>

        {/* Feature Highlights */}
        <ul className="text-left text-gray-600 space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <li className="flex items-center gap-2">
            <FaUsers className="text-blue-400" /> Find and follow interesting people.
          </li>
          <li className="flex items-center gap-2">
            <FaImage className="text-green-400" /> Post stories, photos and videos.
          </li>
          <li className="flex items-center gap-2">
            <FaComments className="text-purple-400" /> Connect via comments and messages.
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition-all text-white font-semibold px-5 py-2 rounded-full shadow-lg w-full sm:w-auto"
          >
            Join Now
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-100 font-semibold px-5 py-2 rounded-full transition-all w-full sm:w-auto"
          >
            Sign In
          </button>
        </div>

        {/* Global Badge */}
        <span className="mt-3 text-[10px] sm:text-xs px-2 sm:px-3 py-1 bg-blue-100 text-blue-500 rounded-full shadow-sm">
          🌍 Trusted by users worldwide
        </span>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex items-center justify-center relative w-full max-w-sm sm:max-w-md lg:max-w-xl mt-6 lg:mt-0">
        {/* Collage Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <img src={images.banner1} alt="Banner 1" className="rounded-lg sm:rounded-xl shadow-md hover:scale-105 transition-all" />
          <img src={images.banner2} alt="Banner 2" className="rounded-lg sm:rounded-xl shadow-md hover:scale-105 transition-all" />
          <img src={images.banner3} alt="Banner 3" className="rounded-lg sm:rounded-xl shadow-md hover:scale-105 transition-all" />
          <img src={images.banner4} alt="Banner 4" className="rounded-lg sm:rounded-xl shadow-md hover:scale-105 transition-all" />
        </div>
      </div>
    </div>
  );
};

export default Template;
