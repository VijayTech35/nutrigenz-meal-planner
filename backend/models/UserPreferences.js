import db from '../config/db.js';

class UserPreferences {
  static async create({ userId, dietaryRestrictions, allergies, preferredCuisines, defaultServings, measurementUnit }) {
    const result = await db.query(
      `INSERT INTO user_preferences (user_id, dietary_restrictions, allergies, preferred_cuisines, default_servings, measurement_unit)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, dietaryRestrictions || [], allergies || [], preferredCuisines || [], defaultServings || 4, measurementUnit || 'metric']
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await db.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    return result.rows[0] || null;
  }

  static async update(userId, updates) {
    const { dietaryRestrictions, allergies, preferredCuisines, defaultServings, measurementUnit } = updates;

    const result = await db.query(
      `UPDATE user_preferences
       SET dietary_restrictions = COALESCE($1, dietary_restrictions),
           allergies = COALESCE($2, allergies),
           preferred_cuisines = COALESCE($3, preferred_cuisines),
           default_servings = COALESCE($4, default_servings),
           measurement_unit = COALESCE($5, measurement_unit)
       WHERE user_id = $6
       RETURNING *`,
      [dietaryRestrictions, allergies, preferredCuisines, defaultServings, measurementUnit, userId]
    );
    return result.rows[0];
  }

  static async delete(userId) {
    await db.query(
      'DELETE FROM user_preferences WHERE user_id = $1',
      [userId]
    );
  }
}

export default UserPreferences;
