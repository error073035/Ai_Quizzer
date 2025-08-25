const Joi = require("joi");

const submitQuizSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedOption: Joi.string().required(),
      })
    )
    .required(),
});

const historyQuerySchema = Joi.object({
  grade: Joi.number().integer().min(1).max(12),
  subject: Joi.string(),
  marksMin: Joi.number().min(0),
  marksMax: Joi.number().max(100),
  from: Joi.date().iso(),
  to: Joi.date().iso(),
});

module.exports = { submitQuizSchema, historyQuerySchema };
