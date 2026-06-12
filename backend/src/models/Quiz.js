const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    publicId: { type: String, required: true, index: true },
    // Removed Supabase userId
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    responseCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

// Text index for search functionality
QuizSchema.index({ title: "text", description: "text" });

// Virtual populate for response count
QuizSchema.virtual("responses", {
  ref: "Response",
  localField: "_id",
  foreignField: "quiz",
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
