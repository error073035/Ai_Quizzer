const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser, getProfile} = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/auth.middlware.js');
const validate = require('../middlewares/validate.middleware.js');
const {registerSchema, loginSchema} = require('../validations/auth.validation.js');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and profile
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: kahanhirani
 *               email:
 *                 type: string
 *                 example: kahanhirani@example.com
 *               password:
 *                 type: string
 *                 example: kahanhirami123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user:
 *                 id: 123
 *                 name: kahanhirani
 *                 email: kahanhirani@example.com
 *       400:
 *         description: Validation error
 */
router.post('/register', validate(registerSchema), registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: kahanhirani@example.com
 *               password:
 *                 type: string
 *                 example: kahanhirani123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               token: jwt_token_here
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), loginUser);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Logged out
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', isAuthenticated, logoutUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user:
 *                 id: 123
 *                 name: kahanhirani
 *                 email: kahanhirani@example.com
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', isAuthenticated, getProfile);

module.exports = router;