const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret._id;

        // Ensure answers are serialized as string IDs
        if (Array.isArray(ret.answers)) {
          ret.answers = ret.answers.map((a) =>
            typeof a === "object" && a !== null && a._id
              ? a._id.toString()
              : a.toString()
          );
        }
      },
    },
  }
);

const Response = mongoose.model("Response", ResponseSchema);
module.exports = Response;
