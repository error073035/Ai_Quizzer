const Submission = require("../models/submission.model");
const asyncHandler = require("../utilities/asyncHandler.utility");
const ErrorHandler = require("../utilities/errorHandler.utility");
const redis = require("../db/redis");

const getLeaderboard = asyncHandler(async (req, res, next) => {
  const { subject, grade, limit = 10 } = req.query;

  const filter = {};
  if (subject) filter.subject = subject;
  if (grade) filter.grade = Number(grade);

  const cacheKey = `leaderboard:${subject || "all"}:${grade || "all"}:${limit}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      cached: true,
      leaderboard: JSON.parse(cached),
    });
  }

  const leaderboard = await Submission.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$userId",
        avgScore: { $avg: "$score" },
        maxScore: { $max: "$score" },
        attempts: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $sort: { maxScore: -1 } },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        username: "$user.username",
        avgScore: 1,
        maxScore: 1,
        attempts: 1,
      },
    },
  ]);

  await redis.set(cacheKey, JSON.stringify(leaderboard), "EX", 60);

  res.status(200).json({
    success: true,
    cached: false,
    leaderboard,
  });
});

module.exports = { getLeaderboard };
