import { uploadCloudinary } from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";


export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;

    // Upload media to Cloudinary if file exists
    let media = null;
    if (req.file) {
      const result = await uploadCloudinary(req.file.path);
      media = {
        url: result.secure_url,
        publicId: result.public_id,
        //contentType: req.file.mimetype,
      };
    } else {
      return res.status(400).json({
        success: false,
        message: `Media is required`,
      });
    }

    // Create post
    const post = await Post.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    });

    // Add post to user's posts array
    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();

    // Populate author details in response
    const populatedPost = await Post.findById(post._id).populate("author", "name userName profileImage");

    return res.status(200).json({
      success: true,
      post: populatedPost,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to post: ${error.message}`,
    });
  }
};



export const getAllPost = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.userId);
    const followingIds = loggedInUser.following;

    // Include posts from the user and those they follow
    const posts = await Post.find({
      author: { $in: [req.userId, ...followingIds] }
    })
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get all Post: ${error.message}`
    });
  }
};
;


export const like = async (req , res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
    if(!post){
      return res.status(400).json({
        success: false,
        message: "Post not found"
      })
    }

    const alreadyLiked = post.likes.some(id => id.toString() == req.userId.toString())

    if(alreadyLiked){
      post.likes= post.likes.filter(id=> id.toString() !== req.userId.toString())
    } else{
      post.likes.push(req.userId)
      if(post.author._id != req.userId){
        const notification = await Notification.create({
          sender: req.userId,
          receiver: post.author._id,
          type: "like",
          post: post._id,
          message: "liked your post"
        })

        const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
        const receiverSocketId = getSocketId(post.author._id)
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newNotification", populatedNotification)
        }
      }
    }
    
    await post.save()
    post.populate("author", "name userName profileImage")
    io.emit("likedPost", {postId: post._id, likes: post.likes})
    return res.status(200).json({
      success: true,
      post

    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to likes: ${error.message}`
    });
  }
}


export const comment = async (req , res ) => {
  try {
    const {message} = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId)
    if(!post){
    return res.status(400).json({
      success: false,
      message: "Post not found"
    })
    }
     post.comments.push({
      author: req.userId,
      message
    })
    if(post.author._id != req.userId){
        const notification = await Notification.create({
          sender: req.userId,
          receiver: post.author._id,
          type: "comment",
          post: post._id,
          message: "Commented on your post"
        })

        const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
        const receiverSocketId = getSocketId(post.author._id)
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newNotification", populatedNotification)
        }
      }
   
    await post.save()
    await post.populate("author", "name userName profileImage")
     post.populate("comments.author")

      io.emit("commentedPost", {postId: post._id, comments: post.comments})

      return res.status(200).json({
      success: true,
      post

    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to comment: ${error.message}`
    });
  }
}



export const saved = async (req , res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
    const user =await User.findById(req.userId)
    if(!post){
      return res.status(400).json({
        success: false,
        message: "Post not found"
      })
    }

    const alreadySaved = user.saved.some(id => id.toString() == postId.toString())

    if(alreadySaved){
      user.saved = user.saved.filter(id => id.toString() !== postId.toString());

    } else{
      user.saved.push(postId)
    }
    await user.save()
    await user.populate("saved")
    return res.status(200).json({
      success: true,
      post, user

    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to save post: ${error.message}`
    });
  }
}