const Submission = require("../models/submission.model");
const Quiz = require("../models/quiz.model");
const User = require("../models/user.model");
const asyncHandler = require("../utilities/asyncHandler.utility");
const ErrorHandler = require("../utilities/errorHandler.utility");
const axios = require("axios");
const sendEmail = require("../utilities/email");

async function generateImprovementTips(mistakes) {
  if (!mistakes || mistakes.length === 0) {
    return ["Great job!", "Keep practicing!"];
  }

  const prompt = `The student made the following mistakes: ${JSON.stringify(
    mistakes
  )}. Suggest 2 short improvement tips for them. 
  Return only a valid JSON array of strings, nothing else.`;

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
  if (raw.startsWith("```")) {
    raw = raw.replace(/```json/i, "").replace(/```/g, "").trim();
  }

  try {
    return JSON.parse(raw);
  } catch {
    return ["Review your mistakes carefully.", "Focus on weak areas."];
  }
}

const submitQuiz = asyncHandler(async (req, res, next) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  const userId = req.user.id;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return next(new ErrorHandler("Quiz not found", 404));

  if (!answers || !Array.isArray(answers)) {
    return next(new ErrorHandler("Answers must be an array", 400));
  }

  let score = 0;
  const mistakes = [];

  const evaluatedAnswers = quiz.questions
    .map((q) => {
      const userAns = answers.find((a) => a.questionId == q._id.toString());
      if (!userAns) return null;

      const isCorrect = userAns.selectedOption === q.answerKey;
      if (isCorrect) score++;
      else mistakes.push({ questionId: q._id, expected: q.answerKey, got: userAns.selectedOption });

      return {
        questionId: q._id,
        selectedOption: userAns.selectedOption,
        isCorrect,
      };
    })
    .filter(Boolean);

  const suggestions = await generateImprovementTips(mistakes);

  const prevAttempts = await Submission.find({ quizId, userId });
  const attemptNo = prevAttempts.length + 1;

  const submission = await Submission.create({
    userId,
    quizId,
    answers: evaluatedAnswers,
    score,
    mistakes,
    suggestions,
    attemptNo,
    grade: quiz.grade,
    subject: quiz.subject,
  });

  const user = await User.findById(userId);
  if (user?.email) {
    await sendEmail(
      user.email,
      `Your Quiz Results (Attempt ${attemptNo})`,
      `
      <h2>Quiz Results</h2>
      <p><b>Subject:</b> ${quiz.subject}</p>
      <p><b>Grade:</b> ${quiz.grade}</p>
      <p><b>Score:</b> ${score}/${quiz.questions.length}</p>
      <p><b>Suggestions:</b> ${suggestions.join(", ")}</p>
      `
    );
  }

  res.status(201).json({
    success: true,
    score,
    attemptNo,
    suggestions,
    submission,
  });
});

const retryQuiz = asyncHandler(async (req, res, next) => {
  return submitQuiz(req, res, next);
});

const getQuizHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { grade, subject, marksMin, marksMax, from, to } = req.query;

  const filter = { userId };

  if (grade) filter.grade = Number(grade);
  if (subject) filter.subject = subject;
  if (marksMin || marksMax) {
    filter.score = {};
    if (marksMin) filter.score.$gte = Number(marksMin);
    if (marksMax) filter.score.$lte = Number(marksMax);
  }
  if (from || to) {
    filter.completedAt = {};
    if (from) filter.completedAt.$gte = new Date(from);
    if (to) filter.completedAt.$lte = new Date(to);
  }

  const history = await Submission.find(filter).sort({ completedAt: -1 });

  res.status(200).json({
    success: true,
    count: history.length,
    history,
  });
});

module.exports = {
  submitQuiz,
  retryQuiz,
  getQuizHistory,
};
