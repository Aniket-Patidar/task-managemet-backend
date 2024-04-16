const express = require('express');
const router = express.Router();
const authenticateJWT = require('../Middleware/auth.js');
const taskController = require('../controllers/userControllers.js');

router.get('/jwt', authenticateJWT, taskController.jwtUser);
router.post('/login', taskController.loginUser);
router.post('/signup', taskController.signupUser);
router.post('/update-profile', authenticateJWT, taskController.uploadAvatar);
router.get('/logout', authenticateJWT, taskController.logoutUser);
router.post('/upload-avatar', authenticateJWT, taskController.uploadAvatar);
router.post('/forgot-password', authenticateJWT, taskController.changePassword);

router.post('/forgot', taskController.sendEmail);
router.post('/reset', taskController.resetPassword);


module.exports = router

