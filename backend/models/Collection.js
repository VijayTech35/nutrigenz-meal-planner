import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export default {
  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM collections WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM collections WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  },

  async create(userId, { name, description }) {
    const result = await pool.query(
      'INSERT INTO collections (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, description]
    );
    return result.rows[0];
  },

  async update(id, userId, { name, description }) {
    const result = await pool.query(
      'UPDATE collections SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, description, id, userId]
    );
    return result.rows[0];
  },

  async delete(id, userId) {
    await pool.query('DELETE FROM collection_recipes WHERE collection_id = $1', [id]);
    await pool.query('DELETE FROM collections WHERE id = $1 AND user_id = $2', [id, userId]);
  },

  async addRecipe(collectionId, userId, recipeId) {
    await pool.query(
      'INSERT INTO collection_recipes (collection_id, recipe_id) VALUES ($1, $2)',
      [collectionId, recipeId]
    );
  },

  async removeRecipe(collectionId, userId, recipeId) {
    await pool.query(
      'DELETE FROM collection_recipes WHERE collection_id = $1 AND recipe_id = $2',
      [collectionId, recipeId]
    );
  },

  async getRecipesInCollection(collectionId, userId) {
    const result = await pool.query(
      `SELECT r.* FROM recipes r
       JOIN collection_recipes cr ON r.id = cr.recipe_id
       WHERE cr.collection_id = $1 AND r.user_id = $2
       ORDER BY cr.added_at DESC`,
      [collectionId, userId]
    );
    return result.rows;
  }
};
