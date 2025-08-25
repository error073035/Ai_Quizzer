const Joi = require("joi");

const createQuizSchema = Joi.object({
  subject: Joi.string().required(),
  grade: Joi.number().integer().min(1).max(12).required(),
  numQuestions: Joi.number().integer().min(1).max(20).default(5),
});

module.exports = { createQuizSchema };
