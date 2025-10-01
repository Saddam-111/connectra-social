import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoryCard from "../components/StoryCard";
import axios from "axios";

const Story = () => {
  const { userName } = useParams();
  const [story, setStory] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

const fetchStory = async () => {
  try {
    const urlName = userName || "Your Story"; // fallback
    const res = await axios.get(`${baseUrl}/api/story/getByUserName/${urlName}`, {
      withCredentials: true,
    });
    setStory(res.data.story);
  } catch (error) {
    console.log(error);
    setStory(null);
  }
};


  useEffect(() => {
    if (userName) fetchStory();
  }, [userName]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-4">
      <StoryCard story={story} />
    </div>
  );
};

export default Story;
