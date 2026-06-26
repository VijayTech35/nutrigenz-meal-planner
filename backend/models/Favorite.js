import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export default {
  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT f.*, r.name as recipe_name, r.cuisine_type, r.prep_time, r.cook_time, r.difficulty, r.image_url
       FROM favorites f
       JOIN recipes r ON f.recipe_id = r.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async findByUserAndRecipe(userId, recipeId) {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );
    return result.rows[0];
  },

  async create(userId, recipeId) {
    const result = await pool.query(
      'INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) RETURNING *',
      [userId, recipeId]
    );
    return result.rows[0];
  },

  async delete(userId, recipeId) {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );
  },

  async isFavorite(userId, recipeId) {
    const result = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );
    return result.rows.length > 0;
  }
};
