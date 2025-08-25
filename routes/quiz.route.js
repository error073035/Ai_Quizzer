const express = require('express');
const router = express.Router();
const { createQuiz, getQuizById, getUserQuizzes, deleteQuiz } = require('../controllers/quiz.controller.js');
const isAuthenticated = require('../middlewares/auth.middlware.js');
const validate = require('../middlewares/validate.middleware.js');
const { createQuizSchema } = require('../validations/quiz.validation.js');
const { generateHint } = require('../controllers/hint.controller.js');

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz management and AI features
 */

/**
 * @swagger
 * /quiz:
 *   post:
 *     summary: Create a quiz (AI-generated questions)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subject, grade, numQuestions]
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Mathematics
 *               grade:
 *                 type: integer
 *                 example: 8
 *               numQuestions:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               quiz:
 *                 id: 456
 *                 subject: Mathematics
 *                 grade: 8
 *                 questions: [ ... ]
 *       400:
 *         description: Validation error
 */
router.post('/', isAuthenticated, validate(createQuizSchema), createQuiz);

/**
 * @swagger
 * /quiz/{quizId}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               quiz: { ... }
 *       404:
 *         description: Quiz not found
 */
router.get('/:quizId', isAuthenticated, getQuizById);

/**
 * @swagger
 * /quiz:
 *   get:
 *     summary: Get all quizzes created by the user
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               quizzes: [ ... ]
 */
router.get('/', isAuthenticated, getUserQuizzes);

/**
 * @swagger
 * /quiz/{quizId}:
 *   delete:
 *     summary: Delete quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz deleted
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 */
router.delete('/:quizId', isAuthenticated, deleteQuiz);

/**
 * @swagger
 * /quiz/{quizId}/hint:
 *   post:
 *     summary: Get AI-generated hint for a question
 *     tags: [Quiz]
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
 *             required: [questionId]
 *             properties:
 *               questionId:
 *                 type: string
 *                 example: 789
 *     responses:
 *       200:
 *         description: Hint generated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               hint: "Try breaking the problem into smaller steps."
 *       404:
 *         description: Quiz or question not found
 */
router.post('/:quizId/hint', isAuthenticated, generateHint);

module.exports = router;