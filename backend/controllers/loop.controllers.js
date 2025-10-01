import { uploadCloudinary } from "../config/cloudinary.js";
import Loop from "../models/loop.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { io, getSocketId } from "../socket.js";


export const uploadLoop = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      const result = await uploadCloudinary(req.file.path);
      media = {
        url: result.secure_url,
        publicId: result.public_id,
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Media is required`,
      });
    }
    const loop = await Loop.create({
      caption,
      media,
      author: req.userId
    })
    const user = await User.findById(req.userId)
    user.loops.push(loop._id)
    await user.save()
    const populatedLoop = await Loop.findById(loop._id).populate("author", "name userName profileImage")
    return res.status(200).json({
      success: true,
      loop:populatedLoop,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload loop"
    })
  }
}




export const like = async (req, res) => {
  try {
    const loop = await Loop.findById(req.params.loopId)
    if (!loop) return res.status(400).json({ success: false, message: "Loop not found" })

    const alreadyLiked = loop.likes.includes(req.userId)
    if (alreadyLiked) {
      loop.likes = loop.likes.filter(id => id.toString() !== req.userId.toString())
    } else {
      loop.likes.push(req.userId)

      // Send notification if not liking own loop
      if (loop.author.toString() !== req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: loop.author,
          type: "like",
          post: loop._id,
          message: "liked your loop"
        })

        const populatedNotification = await Notification.findById(notification._id)
          .populate("sender receiver post")
        
        const receiverSocketId = getSocketId(loop.author)
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newNotification", populatedNotification)
        }
      }
    }

    await loop.save()
    await loop.populate("author", "name userName profileImage")

    // Emit real-time update
    io.emit("likedLoop", { loopId: loop._id, likes: loop.likes })

    res.status(200).json({ success: true, loop })
  } catch (error) {
    res.status(500).json({ success: false, message: `Failed to like: ${error.message}` })
  }
}

export const comment = async (req, res) => {
  try {
    const { message } = req.body
    const loop = await Loop.findById(req.params.loopId)
    if (!loop) return res.status(400).json({ success: false, message: "Loop not found" })

    loop.comments.push({ author: req.userId, message })

    // Send notification if not commenting on own loop
    if (loop.author.toString() !== req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: loop.author,
        type: "comment",
        post: loop._id,
        message: "commented on your loop"
      })

      const populatedNotification = await Notification.findById(notification._id)
        .populate("sender receiver post")
      
      const receiverSocketId = getSocketId(loop.author)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification)
      }
    }

    await loop.save()
    await loop.populate("author", "name userName profileImage")
    await loop.populate("comments.author")

    io.emit("commentedLoop", { loopId: loop._id, comments: loop.comments })

    res.status(200).json({ success: true, loop })
  } catch (error) {
    res.status(500).json({ success: false, message: `Failed to comment: ${error.message}` })
  }
}



export const getAllLoops = async (req , res) => {
  try {
    const loops = await Loop.find({}).sort({createdAt: -1}).populate("author", "name userName profileImage").populate("comments.author")
    return res.status(200).json({
      success: true,
      loops

    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get all loop: ${error.message}`
    });
  }
}