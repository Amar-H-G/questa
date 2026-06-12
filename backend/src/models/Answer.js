const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema(
  {
    response: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Response",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
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

const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;
