const express = require('express');
const router = express.Router();
const authenticateJWT = require('../Middleware/auth.js');
const taskController = require('../controllers/userControllers.js');

router.post('/jwt', taskController.jwtUser);
router.post('/login', taskController.loginUser);
router.post('/signup', taskController.signupUser);
router.get('/logout', authenticateJWT, taskController.logoutUser);
router.post('/upload-avatar', authenticateJWT, taskController.uploadAvatar);
router.post('/forgot-password', authenticateJWT, taskController.changePassword);

module.exports = router

