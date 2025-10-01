import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { upload } from '../middlewares/multer.js'
import { getAllMessages, getPreviousUserChats, sendMessage } from '../controllers/message.controller.js'


export const messageRouter = express.Router()


messageRouter.post('/send/:receiverId', isAuth,upload.single("image"), sendMessage)

messageRouter.get('/getAll/:receiverId', isAuth, getAllMessages)

messageRouter.get('/prevChats', isAuth, getPreviousUserChats)