import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  uploadStory,
  viewStory,
  deleteStory,
  getAllStories,
  getStoryByUserName,
} from "../controllers/story.controllers.js";

export const storyRouter = express.Router();

storyRouter.post("/upload", isAuth, upload.single("media"), uploadStory);
storyRouter.get("/view/:storyId", isAuth, viewStory);
storyRouter.delete("/delete/:storyId", isAuth, deleteStory);
storyRouter.get("/getAll", isAuth, getAllStories);
storyRouter.get("/getByUserName/:userName", isAuth, getStoryByUserName);
