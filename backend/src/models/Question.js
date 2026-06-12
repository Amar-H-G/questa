const mongoose = require('mongoose');

const QuestionType = {
  SINGLE_CHOICE: "SINGLE_CHOICE",
  SHORT_TEXT: "SHORT_TEXT",
};

const QuestionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

const Question = mongoose.model("Question", QuestionSchema);
module.exports = { Question, QuestionType };
