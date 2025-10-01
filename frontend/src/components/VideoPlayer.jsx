import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPlayingVideo } from "../redux/videoSlice";

const VideoPlayer = ({ media, videoId }) => {
  const videoRef = useRef(null);
  const [mute, setMute] = useState(true);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const dispatch = useDispatch();
  const { currentPlayingVideo } = useSelector((state) => state.video);

  // Play/pause based on currentPlayingVideo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (currentPlayingVideo === videoId) {
      if (!isManuallyPaused) video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [currentPlayingVideo, videoId, isManuallyPaused]);

  // IntersectionObserver to detect visible video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(setCurrentPlayingVideo(videoId));
        } else {
          // pause video if out of view
          video.pause();
        }
      },
      { threshold: 0.75 }
    );

    observer.observe(video);
    return () => observer.unobserve(video);
  }, [dispatch, videoId]);

  // Handle manual click to play/pause
  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsManuallyPaused(false);
      dispatch(setCurrentPlayingVideo(videoId));
    } else {
      video.pause();
      setIsManuallyPaused(true);
    }
  };

  if (!media) return null;

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden rounded-xl bg-black">
      <video
        ref={videoRef}
        src={media}
        muted={mute}
        playsInline
        loop
        onClick={handleClick}
        className="w-full max-h-[70vh] sm:max-h-[500px] object-cover rounded-xl"
      />

      {/* Mute / Unmute */}
      <button
        onClick={() => setMute((prev) => !prev)}
        className="absolute bottom-3 left-3 bg-black/60 p-2 rounded-full text-white hover:scale-110 transition"
      >
        {mute ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
      </button>
    </div>
  );
};

export default VideoPlayer;
