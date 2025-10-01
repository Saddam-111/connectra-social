import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    currentPlayingVideo: null, // store videoId
  },
  reducers: {
    setCurrentPlayingVideo: (state, action) => {
      state.currentPlayingVideo = action.payload;
    },
  },
});

export const { setCurrentPlayingVideo } = videoSlice.actions;
export default videoSlice.reducer;
