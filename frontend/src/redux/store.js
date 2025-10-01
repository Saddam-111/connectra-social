import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice.js'
import postSlice from './postSlice.js'
import storySlice from './storySlice.js'
import loopSlice from './loopSlice.js'
import messageSlice from './messageSlice.js'
import socketSlice from './socketSlice.js'
import videoSlice from './videoSlice.js'
import themeSlice from './themeSlice.js'

export const store = configureStore({
  reducer: {
    user: userSlice,
    video: videoSlice,
    post: postSlice,
    loop: loopSlice,
    story: storySlice,
    message: messageSlice,
    socket: socketSlice,
    theme: themeSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the path where the socket instance lives
        ignoredPaths: ['socket.socket'],
        // Ignore the action that stores the socket
        ignoredActions: ['socket/setSocket']
      }
    })
})
