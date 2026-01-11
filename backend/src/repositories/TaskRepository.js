const pool = require('../config/database');
const Task = require('../entities/Task');

class TaskRepository {
  
  async create({ projectId, userId, title, description, status, priority, dueDate }) {
    const query = `
      INSERT INTO tasks (project_id, user_id, title, description, status, priority, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      projectId, userId, title, description, 
      status || 'todo', priority || 'medium', dueDate
    ]);
    
    return new Task(this.mapDbToEntity(result.rows[0]));
  }

  async findById(id) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    return new Task(this.mapDbToEntity(result.rows[0]));
  }

  // Find all tasks for a user with optional filters
  async findByUser(userId, filters = {}) {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];
    let paramCount = 2;

    // Add status filter
    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    // Add project filter
    if (filters.projectId) {
      query += ` AND project_id = $${paramCount}`;
      params.push(filters.projectId);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows.map(row => new Task(this.mapDbToEntity(row)));
  }

  async update(id, updates) {
    const allowedFields = ['title', 'description', 'status', 'priority', 'due_date', 'completed_at'];
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE tasks 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? new Task(this.mapDbToEntity(result.rows[0])) : null;
  }

  async delete(id) {
    const query = 'DELETE FROM tasks WHERE id = $1';
    await pool.query(query, [id]);
  }

  mapDbToEntity(row) {
    return {
      id: row.id,
      projectId: row.project_id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

module.exports = new TaskRepository();