const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  answerKey: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  hint: {
    type: String,
  },
});

const quizSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adaptiveDifficultyUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
