import express from 'express'
import { isAuth } from '../middlewares/isAuth.js';
import { comment, getAllLoops, like, uploadLoop } from '../controllers/loop.controllers.js';
import { upload } from '../middlewares/multer.js';

export const loopRouter = express.Router();



loopRouter.post('/upload',isAuth,upload.single("media"), uploadLoop )
loopRouter.get('/getAll',isAuth, getAllLoops)
loopRouter.post('/like/:loopId', isAuth, like)
loopRouter.post('/comment/:loopId', isAuth, comment)

