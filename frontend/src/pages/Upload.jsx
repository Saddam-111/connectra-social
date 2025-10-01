import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice.js";
import { setStoryData } from "../redux/storySlice";
import { setLoopData } from "../redux/loopSlice";

const Upload = () => {
  const [uploadType, setUploadType] = useState("post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const mediaInput = useRef();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { loopData } = useSelector((state) => state.loop);
  const { storyData } = useSelector((state) => state.story);

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaType(file.type.includes("image") ? "image" : "video");
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!backendMedia) return alert("Please select a media file!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("media", backendMedia);
      if (caption) formData.append("caption", caption);
      if (mediaType) formData.append("mediaType", mediaType);

      let endpoint =
        uploadType === "post"
          ? "post/upload"
          : uploadType === "story"
          ? "story/upload"
          : "loop/upload";

      const result = await axios.post(`${baseUrl}/api/${endpoint}`, formData, {
        withCredentials: true,
      });

      if (uploadType === "post") dispatch(setPostData([...postData, result.data]));
      else if (uploadType === "story") dispatch(setStoryData([...storyData, result.data]));
      else dispatch(setLoopData([...loopData, result.data]));

      navigate("/");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gradient-to-b from-pink-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      
      {/* Header */}
      <div
        className="w-full flex items-center gap-2 mb-6 cursor-pointer group"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="text-xl text-gray-800 group-hover:text-pink-500 transition" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Upload Media</h1>
      </div>

      {/* Type Selector */}
      <div className="flex gap-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md mb-8">
        {["post", "story", "loop"].map((type) => (
          <button
            key={type}
            onClick={() => setUploadType(type)}
            className={`px-6 py-2 rounded-full font-semibold capitalize transition-all duration-300
              ${
                uploadType === type
                  ? "bg-pink-500 text-white shadow-lg transform scale-105"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:scale-105 hover:shadow-md"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      {!frontendMedia ? (
        <div
          onClick={() => mediaInput.current.click()}
          className="w-full max-w-md h-60 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white dark:bg-gray-700 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-md mb-6"
        >
          <FaPlus className="text-4xl text-gray-400 dark:text-gray-300" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Click to upload {uploadType}
          </p>
          <input
            type="file"
            hidden
            ref={mediaInput}
            accept={uploadType === "loop" ? "video/*" : "image/*,video/*"}
            onChange={handleMedia}
          />
        </div>
      ) : (
        <div className="w-full max-w-md mb-6 flex flex-col items-center gap-4">
          {mediaType === "image" ? (
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-600">
              <img
                src={frontendMedia}
                alt="uploaded"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-600">
              <VideoPlayer media={frontendMedia} />
            </div>
          )}

          {uploadType !== "story" && (
            <input
              type="text"
              placeholder="Write a caption..."
              className="w-full p-3 border rounded-lg outline-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 transition"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          )}
        </div>
      )}

      {/* Upload Button */}
      {frontendMedia && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`px-8 py-3 font-bold rounded-full transition-all duration-300 text-white shadow-lg transform hover:scale-105 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {loading ? `Uploading ${uploadType}...` : `Upload ${uploadType}`}
        </button>
      )}
    </div>
  );
};

export default Upload;
