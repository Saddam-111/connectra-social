
import { uploadCloudinary } from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";



export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .select("-password")
      .populate("posts loops posts.author posts.comments story")

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `get Current user error ${error}`,
    });
  }
};



export const suggestedUsers = async (req , res) => {
  try {
    const users = await User.find({
      _id:{$ne : req.userId}
    }).select("-password")
    res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `get suggested user error ${error}`
    })
  }
}


export const editProfile = async (req , res) => {
  try {
    const { name, userName, bio, profession, gender } = req.body;

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const sameUserWithUserName = await User.findOne({ userName }).select("-password");
    if (sameUserWithUserName && sameUserWithUserName._id != req.userId) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    let profileImage;
    if (req.file) {
      const uploadResult = await uploadCloudinary(req.file.path);

      //store both secure_url and public_id
      profileImage = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }



    user.name = name;
    user.userName = userName;
    user.bio = bio;
    user.profession = profession;
    user.gender = gender;

    if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to edit profile: ${error.message}`
    });
  }
};







export const getProfile = async (req , res) => {
  try {
    const userName = req.params.userName
    const user = await User.findOne({userName}).select("-password")
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    return res.status(200).json({
        success: true,
        user
      })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to found user ${error}`
    })
  }
}


export const follow = async (req , res) => {
  try {
    const currentUserId = req.userId
    const targetUserId = req.params.targetUserId
    if(!targetUserId){
      return res.status(400).json({
        success: false, 
        mes: "User Not found"
      })
    }
    if(currentUserId== targetUserId){
      return res.status(400).json({
        success: false, 
        message: "You cann't follow yourself"
      })
    }
    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(targetUserId)
    const isFollowing = currentUser.following.includes(targetUserId)
    if(isFollowing){
      currentUser.following = currentUser.following.filter(id => id.toString() != targetUserId)
      targetUser.followers = targetUser.followers.filter(id => id.toString() != currentUserId)
    
    await currentUser.save()
    await targetUser.save()
    return res.status(200).json({
      success: true,
      following: false,
      message: "unfollow success"
    })
  } else{
    currentUser.following.push(targetUserId)
    targetUser.followers.push(currentUserId)
    if(currentUser._id != targetUser._id){
      const notification = await Notification.create({
        sender: currentUser._id,
        receiver: targetUser._id,
        type: "follow",
        message: "started following you"
      })
      const populatedNotification = await Notification.findById(notification._id).populate("sender receiver")
      const receiverSocketId = getSocketId(targetUser._id)
      if(receiverSocketId){
        io.to(receiverSocketId).emit("newNotification", populatedNotification)
      }
    }
    await currentUser.save()
    await targetUser.save()
    return res.status(200).json({
      success: true,
      following: true,
      message: "follow successfully"
    })
  }
  } catch (error) {
     res.status(500).json({
      success: false,
      message: `Failed to follow ${error}`
    })
  }
}


export const followingList = async (req, res) => {
  try {
    const result = await User.findById(req.userId)
      .populate("following", "_id userName profileImage name"); // populate only needed fields

    return res.status(200).json(result.following);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Following list error"
    });
  }
};



export const search = async (req , res) => {
  try {
    const keyword = req.query.keyword

    if(!keyword){
      return res.status(400).json({
        success: false,
        message: "keyword is required"
      })
    }

    const users = await User.find({
      $or:[
        {userName: {$regex: keyword, $options: "i"}},
        {name: {$regex: keyword, $options: "i"}}
      ]
    }).select("-password")

    return res.status(200).json({
      users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Search error"
    });
  }
}


export const getAllNotification = async (req , res) => {
  try {
    const notification = await Notification.find({receiver: req.userId}).populate("sender receiver post loop").sort({createdAt: -1})
    return res.status(200).json(notification)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Notification error"
    });
  }
}


export const markAsRead = async (req, res) => {
  try {
    const {notificationId} = req.body
    
    if(Array.isArray(notificationId)){
      //bulk mark as read
      await Notification.updateMany(
        {_id: {$in : notificationId}, receiver: req.userId},
        {$set: {isRead: true}}
      );
    } else{
      //mark single notification as read
      await Notification.findOneAndUpdate(
        {_id: notificationId, receiver: req.userId}, {$set: {isRead: true}}
      );
    }

    return res.status(200).json({message: "mark as read"})
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Notification error"
    });
  }
}