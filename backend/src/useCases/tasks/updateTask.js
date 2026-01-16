const TaskRepository = require('../../repositories/TaskRepository');
const Task = require('../../entities/Task');
const { AppError } = require('../../middleware/errorHandler');

async function updateTask(taskId, userId, updates) {
  const task = await TaskRepository.findById(taskId);
  
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.userId !== userId) {
    throw new AppError('Not authorized to update this task', 403);
  }

  if (updates.status && !Task.isValidStatus(updates.status)) {
    throw new AppError('Invalid status value', 400);
  }

  if (updates.priority && !Task.isValidPriority(updates.priority)) {
    throw new AppError('Invalid priority value', 400);
  }

  const updatedTask = await TaskRepository.update(taskId, updates);
  return updatedTask;
}

module.exports = updateTask;