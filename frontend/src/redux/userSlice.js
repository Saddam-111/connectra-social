import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null, // ✅ set to null or {} if needed
    suggestedUsers: [],
    profileData: {},
    followingList: [],
    searchData: null,
    notificationData: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    toggleFollow: (state, action) => {
      const targetUserId = action.payload;
      const following = state.userData?.user?.following || [];

      if (following.includes(targetUserId)) {
        state.userData.user.following = following.filter(id => id !== targetUserId);
      } else {
        state.userData.user.following.push(targetUserId);
      }
    },
    setFollowingList : (state, action) => {
      state.followingList = action.payload
    },
    setSearchData : (state, action) => {
      state.searchData = action.payload
    },
    setNotificationData : (state, action) => {
      state.notificationData = action.payload
    }
  },
});

export const {
  setUserData,
  setSuggestedUsers,
  setProfileData,
  toggleFollow, 
  setFollowingList,
  setSearchData,
  setNotificationData
} = userSlice.actions;

export default userSlice.reducer;
