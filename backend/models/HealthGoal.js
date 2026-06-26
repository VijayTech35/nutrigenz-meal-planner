import db from '../config/db.js';

export default {
  async findByUserId(userId) {
    const result = await db.query(
      'SELECT * FROM health_goals WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async upsert(userId, data) {
    const { goalType, age, gender, weight, height, activityLevel, targetCalories, targetProtein, targetCarbs, targetFats, mealsPerDay } = data;
    const result = await db.query(
      `INSERT INTO health_goals (user_id, goal_type, age, gender, weight, height, activity_level, target_calories, target_protein, target_carbs, target_fats, meals_per_day)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (user_id) DO UPDATE SET
         goal_type = EXCLUDED.goal_type,
         age = EXCLUDED.age,
         gender = EXCLUDED.gender,
         weight = EXCLUDED.weight,
         height = EXCLUDED.height,
         activity_level = EXCLUDED.activity_level,
         target_calories = EXCLUDED.target_calories,
         target_protein = EXCLUDED.target_protein,
         target_carbs = EXCLUDED.target_carbs,
         target_fats = EXCLUDED.target_fats,
         meals_per_day = EXCLUDED.meals_per_day,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, goalType || 'maintain', age, gender, weight, height, activityLevel || 'moderate',
       targetCalories, targetProtein, targetCarbs, targetFats, mealsPerDay || 3]
    );
    return result.rows[0];
  },

  async delete(userId) {
    await db.query('DELETE FROM health_goals WHERE user_id = $1', [userId]);
  }
};
