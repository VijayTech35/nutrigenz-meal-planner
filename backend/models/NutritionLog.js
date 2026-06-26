import db from '../config/db.js';

export default {
  async findByUserIdAndDate(userId, date) {
    const result = await db.query(
      `SELECT * FROM nutrition_log WHERE user_id = $1 AND log_date = $2 ORDER BY meal_type, created_at`,
      [userId, date]
    );
    return result.rows;
  },

  async getTodayTotals(userId) {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.query(
      `SELECT
        COALESCE(SUM(calories), 0) as calories,
        COALESCE(SUM(protein), 0) as protein,
        COALESCE(SUM(carbs), 0) as carbs,
        COALESCE(SUM(fats), 0) as fats,
        COALESCE(SUM(fiber), 0) as fiber
       FROM nutrition_log WHERE user_id = $1 AND log_date = $2`,
      [userId, today]
    );
    return result.rows[0];
  },

  async getWeekTotals(userId) {
    const result = await db.query(
      `SELECT
        log_date,
        SUM(calories) as calories,
        SUM(protein) as protein,
        SUM(carbs) as carbs,
        SUM(fats) as fats
       FROM nutrition_log WHERE user_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '6 days'
       GROUP BY log_date ORDER BY log_date`,
      [userId]
    );
    return result.rows;
  },

  async create(userId, { recipeId, recipeName, mealType, servings, calories, protein, carbs, fats, fiber }) {
    const date = new Date().toISOString().split('T')[0];
    const result = await db.query(
      `INSERT INTO nutrition_log (user_id, log_date, meal_type, recipe_id, recipe_name, servings, calories, protein, carbs, fats, fiber)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [userId, date, mealType, recipeId, recipeName, servings || 1, calories || 0, protein || 0, carbs || 0, fats || 0, fiber || 0]
    );
    return result.rows[0];
  },

  async delete(id, userId) {
    await db.query('DELETE FROM nutrition_log WHERE id = $1 AND user_id = $2', [id, userId]);
  },

  async clearDate(userId, date) {
    await db.query('DELETE FROM nutrition_log WHERE user_id = $1 AND log_date = $2', [userId, date]);
  },

  async getStats(userId) {
    const result = await db.query(
      `SELECT
        COUNT(DISTINCT log_date) as days_logged,
        COALESCE(SUM(calories), 0) as total_calories,
        MAX(log_date) as last_logged
       FROM nutrition_log WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }
};
