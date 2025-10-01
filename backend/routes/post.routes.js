import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { upload } from '../middlewares/multer.js'
import { comment, getAllPost, like, saved, uploadPost } from '../controllers/post.controllers.js'


export const postRouter = express.Router()

postRouter.post('/upload', isAuth, upload.single("media"), uploadPost)
postRouter.get('/getAllPost', isAuth, getAllPost)
postRouter.post('/like/:postId', isAuth,like)
postRouter.post('/comment/:postId', isAuth, comment)
postRouter.post('/saved/:postId', isAuth, saved)