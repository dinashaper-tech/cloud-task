const pool = require('../config/database');
const User = require('../entities/User');

// all database operations for User entity
class UserRepository {
  
  // Create new user
  async create({ email, passwordHash, firstName, lastName }) {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [email, passwordHash, firstName, lastName]);
    return new User(this.mapDbToEntity(result.rows[0]));
  }

  // Find user by ID
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    return new User(this.mapDbToEntity(result.rows[0]));
  }

  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) return null;
    return new User(this.mapDbToEntity(result.rows[0]));
  }

  // Update user profile
  async update(id, updates) {
    const allowedFields = ['first_name', 'last_name', 'avatar_url'];
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
      UPDATE users 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? new User(this.mapDbToEntity(result.rows[0])) : null;
  }

  // Delete user
  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Map database column names to entity properties
  mapDbToEntity(row) {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      firstName: row.first_name,
      lastName: row.last_name,
      avatarUrl: row.avatar_url,
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

module.exports = new UserRepository();