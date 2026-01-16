const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

router.post('/', taskController.create.bind(taskController));
router.get('/', taskController.getAll.bind(taskController));
router.patch('/:id', taskController.update.bind(taskController));
router.delete('/:id', taskController.delete.bind(taskController));

router.post('/', validate('createTask'), taskController.create.bind(taskController));

module.exports = router;