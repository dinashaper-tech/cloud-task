const TaskRepository = require('../../repositories/TaskRepository');

async function getTasks(userId, filters = {}) {
  const tasks = await TaskRepository.findByUser(userId, filters);
  return tasks;
}

module.exports = getTasks;