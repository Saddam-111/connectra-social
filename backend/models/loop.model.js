import mongoose from "mongoose";


const loopSchema = new mongoose.Schema({
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaType: {
      type: String,
     
    },
    media: {
      url: { type: String },
      publicId: { type: String },
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 2200, // similar to Instagram
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ]
},{timestamps: true})

const Loop = mongoose.model('Loop', loopSchema);
export default Loop;