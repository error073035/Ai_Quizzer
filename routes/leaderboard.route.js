const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controllers/leaderboard.controller");
const isAuthenticated = require('../middlewares/auth.middlware.js');
const validate = require("../middlewares/validate.middleware");
const validateQuery = require("../middlewares/validateQuery.middleware");
const { leaderboardQuerySchema } = require("../validations/leaderboard.validation");

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Student leaderboard
 */

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get top students leaderboard
 *     tags: [Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard data
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               leaderboard:
 *                 - userId: 123
 *                   name: kahanhirani
 *                   score: 95
 *                   attempts: 10
 */
router.get("/", isAuthenticated, validateQuery(leaderboardQuerySchema), getLeaderboard);

module.exports = router;
