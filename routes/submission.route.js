const express = require("express");
const router = express.Router();
const { submitQuiz, retryQuiz, getQuizHistory } = require("../controllers/submission.controller");
const isAuthenticated = require('../middlewares/auth.middlware.js');
const validate = require("../middlewares/validate.middleware");
const validateQuery = require("../middlewares/validateQuery.middleware");
const { submitQuizSchema, historyQuerySchema } = require("../validations/submission.validation");

/**
 * @swagger
 * tags:
 *   name: Submission
 *   description: Quiz submission and history
 */

/**
 * @swagger
 * /submission/{quizId}/submit:
 *   post:
 *     summary: Submit answers to a quiz
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedOption:
 *                       type: string
 *     responses:
 *       200:
 *         description: Submission successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               score: 4
 *               feedback: [ ... ]
 *       400:
 *         description: Validation error
 */
router.post("/:quizId/submit", isAuthenticated, validate(submitQuizSchema), submitQuiz);

/**
 * @swagger
 * /submission/{quizId}/retry:
 *   post:
 *     summary: Retry quiz submission
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedOption:
 *                       type: string
 *     responses:
 *       200:
 *         description: Retry successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               score: 5
 *               feedback: [ ... ]
 *       400:
 *         description: Validation error
 */
router.post("/:quizId/retry", isAuthenticated, validate(submitQuizSchema), retryQuiz);

/**
 * @swagger
 * /submission/history:
 *   get:
 *     summary: Get quiz submission history with filters
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filter by subject
 *       - in: query
 *         name: grade
 *         schema:
 *           type: integer
 *         description: Filter by grade
 *     responses:
 *       200:
 *         description: Submission history
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               history: [ ... ]
 */
router.get("/history", isAuthenticated, validateQuery(historyQuerySchema), getQuizHistory);

module.exports = router;
