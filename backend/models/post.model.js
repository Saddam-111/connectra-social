import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["image", "video", "none"],
    default: "none",
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
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Post = mongoose.model("Post", postSchema);
export default Post;
