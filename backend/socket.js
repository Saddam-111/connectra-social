import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // allow both dev & prod
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies
  },
});

// Track userId -> socketId
const userSocketMap = {}

// Function to get socket id safely
export const getSocketId = (receiverId) => userSocketMap[receiverId] || null

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  if (userId) {
    userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId]
      io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }
  })
})

export { app, io, server }
