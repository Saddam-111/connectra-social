import { uploadCloudinary } from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket.js";



export const sendMessage = async (req , res) => {
  try {
    const senderId = req.userId
    const receiverId = req.params.receiverId
    const {message} = req.body;

    let image;
    if(req.file){
      const resultUpload = await uploadCloudinary(req.file.path)

      image = {
        url: resultUpload.secure_url,
        publicId: resultUpload.public_id
      }
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image
    })

    //check converstaion already exist

    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, receiverId]}
    })

    if(!conversation){
        conversation = await Conversation.create({
        participants:[senderId, receiverId],
        messages: [newMessage._id]
      })
    } else {
      conversation.messages.push(newMessage._id)
      await conversation.save()
    }

    const receiverSocketId = getSocketId(receiverId)
    if(receiverSocketId){
       io.to(receiverSocketId).emit("newMessage", newMessage)
    }
   

    //populating sender and receiver 
    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "name userName profileImage").populate("receiver", "name userName profileImage");

    return res.status(200).json({
      success: true,
      message: populatedMessage
    })

    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Message sending failed"
    })
  }
}


export const getAllMessages = async (req , res) => {
  try {
    const senderId = req.userId
    const receiverId = req.params.receiverId

    const conversation = await Conversation.findOne({
      participants: {$all: [senderId, receiverId]}
    }).populate("messages")

    return res.status(200).json(conversation?.messages)
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Message getting failed"
    })
  }
}


export const getPreviousUserChats = async (req , res) => {
  try {
    const currentUserId = req.userId
    const conversations = await Conversation.find({
      participants: currentUserId
    }).populate("participants").sort({updatedAt:-1})

    const userMap = {}
    conversations.forEach(conv => {
      conv.participants.forEach(user => {
        if(user._id != currentUserId){
            userMap[user._id] = user
        }
      })
    })

    const previousUser = Object.values(userMap)
    return res.status(200).json({
      success: true,
      previousUser
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Previous user loading failed"
    })
  }
}