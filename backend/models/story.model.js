import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    media: {
      url: { type: String, required: true },
      publicId: { type: String },
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// TTL index to auto-delete stories after 24 hours
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

const Story = mongoose.model("Story", storySchema);
export default Story;
