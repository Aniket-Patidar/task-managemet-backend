const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskControllers');
const authenticateJWT = require('../Middleware/auth');


router.get('/', authenticateJWT, taskController.getAllTasks);
router.post('/', authenticateJWT, taskController.createTask);
router.get('/:id', authenticateJWT, taskController.getTaskById);
router.put('/:id', authenticateJWT, taskController.updateTask);
router.delete('/:id', authenticateJWT, taskController.deleteTask);

module.exports = router;
