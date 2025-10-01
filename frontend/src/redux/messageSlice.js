import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    prevChatUsers: null,
  },

  reducers: {
    setSelectedUser: (state, action) => {
      // ✅ Always normalize to { user: ... }
      if (action.payload?.user) {
        state.selectedUser = action.payload; // already correct
      } else {
        state.selectedUser = { user: action.payload }; // wrap it
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setPrevChatUsers: (state, action) => {
      state.prevChatUsers = action.payload;
    },
  },
});

export const { setSelectedUser, setMessages, setPrevChatUsers } =
  messageSlice.actions;
export default messageSlice.reducer;
