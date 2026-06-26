import db from '../config/db.js';

export default {
  async findByUserId(userId) {
    const result = await db.query(
      `SELECT rv.*, r.name as recipe_name, r.cuisine_type, r.image_url, r.prep_time, r.cook_time
       FROM recently_viewed rv
       JOIN recipes r ON rv.recipe_id = r.id
       WHERE rv.user_id = $1
       ORDER BY rv.viewed_at DESC LIMIT 10`,
      [userId]
    );
    return result.rows;
  },

  async add(userId, recipeId) {
    await db.query(
      `INSERT INTO recently_viewed (user_id, recipe_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, recipe_id) DO UPDATE SET viewed_at = CURRENT_TIMESTAMP`,
      [userId, recipeId]
    );
    const result = await db.query(
      'DELETE FROM recently_viewed WHERE user_id = $1 AND id NOT IN (SELECT id FROM recently_viewed WHERE user_id = $1 ORDER BY viewed_at DESC LIMIT 10)',
      [userId]
    );
    return result;
  },

  async clear(userId) {
    await db.query('DELETE FROM recently_viewed WHERE user_id = $1', [userId]);
  }
};
