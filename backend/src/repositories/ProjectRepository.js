const pool = require('../config/database');
const Project = require('../entities/Project');

class ProjectRepository {
  
  async create({ userId, name, description, color }) {
    const query = `
      INSERT INTO projects (user_id, name, description, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, name, description, color || '#3B82F6']);
    return new Project(this.mapDbToEntity(result.rows[0]));
  }

  async findById(id) {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    return new Project(this.mapDbToEntity(result.rows[0]));
  }

  async findByUser(userId) {
    const query = 'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => new Project(this.mapDbToEntity(row)));
  }

  async update(id, updates) {
    const allowedFields = ['name', 'description', 'color'];
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
      UPDATE projects 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? new Project(this.mapDbToEntity(result.rows[0])) : null;
  }

  async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1';
    await pool.query(query, [id]);
  }

  mapDbToEntity(row) {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      color: row.color,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

module.exports = new ProjectRepository();