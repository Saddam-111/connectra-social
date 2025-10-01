import express from 'express';
import { editProfile, follow, followingList, getAllNotification, getCurrentUser, getProfile, markAsRead, search, suggestedUsers } from '../controllers/user.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';

export const userRouter = express.Router();

userRouter.get('/current', isAuth, getCurrentUser);
userRouter.get('/suggested', isAuth, suggestedUsers);

userRouter.get("/getProfile/:userName",isAuth, getProfile )

userRouter.post('/editProfile', isAuth, upload.single("profileImage"), editProfile)

userRouter.get('/followingList', isAuth, followingList)

userRouter.get("/follow/:targetUserId",isAuth, follow )

userRouter.get("/search", isAuth, search)

userRouter.get("/getAllNotification", isAuth, getAllNotification)

userRouter.post("/markAsRead", isAuth, markAsRead)