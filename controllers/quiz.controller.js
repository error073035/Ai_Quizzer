const Quiz = require("../models/quiz.model");
const Submission = require("../models/submission.model");
const axios = require("axios");
const asyncHandler = require("../utilities/asyncHandler.utility");
const ErrorHandler = require("../utilities/errorHandler.utility.js");
const redis = require("../db/redis");

function getAdaptiveDifficulty(history) {
  if (!history || history.length === 0) return "easy";
  const avgScore = history.reduce((sum, s) => sum + s.score, 0) / history.length;
  if (avgScore > 80) return "hard";
  if (avgScore > 50) return "medium";
  return "easy";
}

async function generateQuestions(subject, grade, difficulty, numQuestions = 5) {
  const prompt = `Generate ${numQuestions} ${difficulty} level ${subject} quiz questions for grade ${grade}.
  Return a valid JSON array. Each object must follow this schema exactly:
  {
    "text": "string", 
    "options": ["string","string","string","string"], 
    "answerKey": "string (must be one of the options)", 
    "difficulty": "${difficulty}"
  }
  Rules:
    - Ensure answerKey is always one of the options.
    - Provide exactly 4 options per question.
    - Do not include explanations or extra text.`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  let raw = response.data.choices[0].message.content.trim();
  console.log("AI response:", raw);

  if (raw.startsWith("```")) {
    raw = raw.replace(/```json/i, "").replace(/```/g, "").trim();
  }

  let questions;
  try {
    questions = JSON.parse(raw);
  } catch (err) {
    throw new ErrorHandler(`Invalid AI response format: ${raw}`, 500);
  }
  return questions;
}

const createQuiz = asyncHandler(async (req, res, next) => {
  const { subject, grade, numQuestions = 5 } = req.body;
  if (!subject || !grade) {
    return next(new ErrorHandler("Subject and grade are required", 400));
  }

  const userId = req.user.id;

  const submissions = await Submission.find({ userId });
  const difficulty = getAdaptiveDifficulty(submissions);

  const questions = await generateQuestions(subject, grade, difficulty, numQuestions);

  if (!questions || questions.length === 0) {
    return next(new ErrorHandler("Failed to generate questions", 500));
  }

  const formattedQuestions = questions.map((q) => ({
    text: q.text,
    options: q.options,
    answerKey: q.answerKey,
    difficulty: q.difficulty || difficulty,
  }));

  const quiz = await Quiz.create({
    createdBy: userId,
    subject,
    grade,
    questions: formattedQuestions,
    adaptiveDifficultyUsed: true,
  });

  await redis.set(`quiz:${quiz._id}`, JSON.stringify(quiz), "EX", 600);

  res.status(201).json({ success: true, quiz });
});

const getQuizById = asyncHandler(async (req, res, next) => {
  const { quizId } = req.params;
  const userId = req.user.id;

  const cached = await redis.get(`quiz:${quizId}`);
  if (cached) {
    return res.status(200).json({ success: true, cached: true, quiz: JSON.parse(cached) });
  }

  const quiz = await Quiz.findOne({ _id: quizId, createdBy: userId });

  if (!quiz) {
    return next(new ErrorHandler("Quiz not found", 404));
  }

  await redis.set(`quiz:${quizId}`, JSON.stringify(quiz), "EX", 600);

  res.status(200).json({
    success: true,
    cached: false,
    quiz,
  });
});

const getUserQuizzes = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const quizzes = await Quiz.find({ createdBy: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: quizzes.length,
    quizzes,
  });
});

const deleteQuiz = asyncHandler(async (req, res, next) => {
  const { quizId } = req.params;
  const userId = req.user.id;

  const quiz = await Quiz.findOneAndDelete({ _id: quizId, createdBy: userId });

  if (!quiz) {
    return next(new ErrorHandler("Quiz not found or not authorized to delete", 404));
  }

  await redis.del(`quiz:${quizId}`);

  res.status(200).json({
    success: true,
    message: "Quiz deleted successfully",
    quiz,
  });
});

module.exports = { createQuiz, getQuizById, getUserQuizzes, deleteQuiz };
