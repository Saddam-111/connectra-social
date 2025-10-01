import React from "react";
import Feed from "./Feed";
import TopBar from "../components/TopBar";

const Middle = () => {
  return (
    <div className="flex flex-col w-full lg:w-[50%] lg:border-x border-gray-300 h-screen overflow-y-auto scrollbar-hide">
      <TopBar />
      <div className="mt-[64px] lg:mt-0"> {/* Push content below TopBar on small screens */}
        <Feed />
      </div>
    </div>
  );
};

export default Middle;
