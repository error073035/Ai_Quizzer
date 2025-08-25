const Joi = require("joi");

const leaderboardQuerySchema = Joi.object({
  grade: Joi.number().integer().min(1).max(12),
  subject: Joi.string(),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

module.exports = { leaderboardQuerySchema };
