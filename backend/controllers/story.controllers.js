import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import { uploadCloudinary } from "../config/cloudinary.js";

// Upload story
export const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }

    if (!req.file) return res.status(400).json({ success: false, message: "Media required" });

    const { mediaType } = req.body;
    const result = await uploadCloudinary(req.file.path);

    const story = await Story.create({
      author: req.userId,
      media: { url: result.secure_url, publicId: result.public_id },
      mediaType,
    });

    user.story = story._id;
    await user.save();

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    res.status(200).json({ success: true, story: populatedStory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Story upload failed" });
  }
};

// View story
export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });

    if (!story.viewers.includes(req.userId)) {
      story.viewers.push(req.userId);
      await story.save();
    }

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    res.status(200).json({ success: true, story: populatedStory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to view story" });
  }
};

// Delete story
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });

    if (story.author.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Story.findByIdAndDelete(storyId);
    const user = await User.findById(req.userId);
    if (user) {
      user.story = null;
      await user.save();
    }

    res.status(200).json({ success: true, message: "Story deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to delete story" });
  }
};

// Get story by username
export const getStoryByUserName = async (req, res) => {
  try {
    let user;
    const { userName } = req.params;

    if (userName === "Your Story" || !userName) {
      // Fetch own story using req.userId
      user = await User.findById(req.userId);
    } else {
      // Fetch other user's story by userName
      user = await User.findOne({ userName });
    }

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const story = await Story.findOne({ author: user._id })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    if (!story) return res.status(404).json({ success: false, message: "No story found" });

    res.status(200).json({ success: true, story });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Fetching story failed" });
  }
};


// Get all stories (feed)
export const getAllStories = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const stories = await Story.find({ author: { $in: user.following } })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, stories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch stories" });
  }
};
