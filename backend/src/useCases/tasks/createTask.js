const TaskRepository = require('../../repositories/TaskRepository');
const Task = require('../../entities/Task');
const { AppError } = require('../../middleware/errorHandler');

async function createTask({ userId, projectId, title, description, priority, dueDate }) {
  if (!title) {
    throw new AppError('Title is required', 400);
  }

  if (priority && !Task.isValidPriority(priority)) {
    throw new AppError('Invalid priority value', 400);
  }

  const task = await TaskRepository.create({
    userId,
    projectId,
    title,
    description,
    priority: priority || 'medium',
    dueDate,
    status: 'todo'
  });

  return task;
}

module.exports = createTask;
