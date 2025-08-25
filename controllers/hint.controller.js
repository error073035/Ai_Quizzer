const Quiz = require("../models/quiz.model");
const asyncHandler = require("../utilities/asyncHandler.utility");
const ErrorHandler = require("../utilities/errorHandler.utility");
const axios = require("axios");

const generateHint = asyncHandler(async (req, res, next) => {
  const { quizId } = req.params;
  const { questionId } = req.body;

  if (!questionId) return next(new ErrorHandler("questionId is required", 400));

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return next(new ErrorHandler("Quiz not found", 404));

  const question = quiz.questions.find((q) => q._id.toString() === questionId);
  if (!question) return next(new ErrorHandler("Question not found", 404));

  const prompt = `Provide a helpful hint (without revealing the answer) for this question: "${question.text}". 
  Options: ${question.options.join(", ")}. 
  Keep it short and student friendly. Return as plain text.`;

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

  let hint = "Think carefully about the problem.";
  try {
    hint = response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("AI hint error:", err);
  }

  res.status(200).json({ success: true, hint });
});

module.exports = { generateHint };
