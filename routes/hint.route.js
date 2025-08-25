const express = require("express");
const { generateHint } = require("../controllers/hint.controller");
const isAuthenticated = require("../middlewares/auth.middlware");
const validate = require("../middlewares/validate.middleware");
const { hintSchema } = require("../validations/hint.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz management and AI features
 */

/**
 * @swagger
 * /quiz/{quizId}/hint:
 *   post:
 *     summary: Get AI generated hint for a question
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
router.post("/:quizId/hint", isAuthenticated, validate(hintSchema), generateHint);

module.exports = router;
