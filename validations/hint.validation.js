const Joi = require("joi");

const hintSchema = Joi.object({
  questionId: Joi.string().required(),
});

module.exports = { hintSchema };
