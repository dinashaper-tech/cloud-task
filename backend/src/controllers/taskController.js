const createTask = require('../useCases/tasks/createTask');
const updateTask = require('../useCases/tasks/updateTask');
const deleteTask = require('../useCases/tasks/deleteTask');
const getTasks = require('../useCases/tasks/getTasks');

class TaskController {
  async create(req, res, next) {
    try {
      const { projectId, title, description, priority, dueDate } = req.body;
      const task = await createTask({
        userId: req.user.id,
        projectId,
        title,
        description,
        priority,
        dueDate
      });

      res.status(201).json({
        status: 'success',
        data: { task: task.toJSON() }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { status, projectId } = req.query;
      const tasks = await getTasks(req.user.id, { status, projectId });

      res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: { tasks: tasks.map(t => t.toJSON()) }
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const task = await updateTask(id, req.user.id, updates);

      res.status(200).json({
        status: 'success',
        data: { task: task.toJSON() }
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await deleteTask(id, req.user.id);

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();