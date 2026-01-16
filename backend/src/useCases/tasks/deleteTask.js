const TaskRepository = require('../../repositories/TaskRepository');
const { AppError } = require('../../middleware/errorHandler');

async function deleteTask(taskId, userId) {
  const task = await TaskRepository.findById(taskId);
  
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.userId !== userId) {
    throw new AppError('Not authorized to delete this task', 403);
  }

  await TaskRepository.delete(taskId);
  return { message: 'Task deleted successfully' };
}

module.exports = deleteTask;