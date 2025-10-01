import express from 'express'
import dotenv from 'dotenv'
import { dbConnect } from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { postRouter } from './routes/post.routes.js';
import { loopRouter } from './routes/loop.routes.js';
import { storyRouter } from './routes/story.routes.js';
import { messageRouter } from './routes/message.routes.js';
import { app, server } from './socket.js';
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
dotenv.config()

const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 50,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
})

app.use(limiter)

const port = process.env.PORT;
app.use(helmet())
app.use(express.json({limit: '10mb'}))
app.use(cookieParser())
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: Origin not allowed"), false);
    }
  },
  credentials: true, // allow cookies
}));


 app.use('/api/auth', authRouter)
 app.use('/api/user',userRouter)
 app.use('/api/post', postRouter)
 app.use('/api/loop', loopRouter)
 app.use('/api/story', storyRouter)
 app.use('/api/message', messageRouter)

app.get('/', (req , res ) => {
  res.send("Api working!")
})


server.listen(port, () => {
  dbConnect()
  console.log("server started!")
})