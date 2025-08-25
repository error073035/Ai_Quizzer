const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [
      {
        questionId: { type: String, required: true },
        selectedOption: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    mistakes: [
      {
        questionId: String,
        expected: String,
        got: String,
      },
    ],
    suggestions: [
      {
        type: String,
      },
    ],
    attemptNo: {
      type: Number,
      default: 1,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
