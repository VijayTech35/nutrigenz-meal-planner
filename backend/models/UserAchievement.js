import db from '../config/db.js';

const ACHIEVEMENTS = [
  { key: 'first_recipe', name: 'First Recipe', description: 'Created your first recipe', icon: 'ChefHat', xp: 50 },
  { key: 'five_recipes', name: 'Recipe Master', description: 'Created 5 recipes', icon: 'UtensilsCrossed', xp: 100 },
  { key: 'ten_recipes', name: 'Recipe Legend', description: 'Created 10 recipes', icon: 'Trophy', xp: 200 },
  { key: 'meal_planned', name: 'Meal Planner', description: 'Planned your first meal', icon: 'Calendar', xp: 50 },
  { key: 'week_streak', name: 'Week Streak', description: 'Logged meals for 7 days', icon: 'Zap', xp: 150 },
  { key: 'pantry_stocked', name: 'Stocked Up', description: 'Added 10 pantry items', icon: 'Package', xp: 75 },
  { key: 'nutrition_tracker', name: 'Nutrition Tracker', description: 'Logged nutrition for 3 days', icon: 'BarChart3', xp: 100 },
  { key: 'shopping_ready', name: 'Shopping Pro', description: 'Generated 5 shopping lists', icon: 'ShoppingBag', xp: 75 },
];

export default {
  getAllAchievements() {
    return ACHIEVEMENTS;
  },

  async findByUserId(userId) {
    const result = await db.query(
      'SELECT * FROM user_achievements WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  },

  async findByUserIdWithMeta(userId) {
    const [unlocked, totalXpResult] = await Promise.all([
      this.findByUserId(userId),
      db.query('SELECT COALESCE(SUM(xp_awarded), 0) as total_xp FROM user_achievements WHERE user_id = $1', [userId])
    ]);
    const totalXp = parseInt(totalXpResult.rows[0].total_xp);
    const level = Math.floor(totalXp / 500) + 1;
    const xpInLevel = totalXp % 500;

    const achievements = ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: unlocked.some(u => u.achievement_key === a.key),
      unlockedAt: unlocked.find(u => u.achievement_key === a.key)?.created_at || null
    }));

    return { achievements, totalXp, level, xpInLevel };
  },

  async award(userId, key) {
    const achievement = ACHIEVEMENTS.find(a => a.key === key);
    if (!achievement) return null;

    const existing = await db.query(
      'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_key = $2',
      [userId, key]
    );
    if (existing.rows.length > 0) return null;

    const result = await db.query(
      'INSERT INTO user_achievements (user_id, achievement_key, xp_awarded) VALUES ($1, $2, $3) RETURNING *',
      [userId, key, achievement.xp]
    );
    return { ...result.rows[0], ...achievement };
  },

  async checkAndAward(userId, stats) {
    const newAchievements = [];
    const { recipeCount, mealPlanCount, pantryCount, nutritionDays, shoppingCount, streakDays } = stats;

    if (recipeCount >= 1) {
      const a = await this.award(userId, 'first_recipe');
      if (a) newAchievements.push(a);
    }
    if (recipeCount >= 5) {
      const a = await this.award(userId, 'five_recipes');
      if (a) newAchievements.push(a);
    }
    if (recipeCount >= 10) {
      const a = await this.award(userId, 'ten_recipes');
      if (a) newAchievements.push(a);
    }
    if (mealPlanCount >= 1) {
      const a = await this.award(userId, 'meal_planned');
      if (a) newAchievements.push(a);
    }
    if (streakDays >= 7) {
      const a = await this.award(userId, 'week_streak');
      if (a) newAchievements.push(a);
    }
    if (pantryCount >= 10) {
      const a = await this.award(userId, 'pantry_stocked');
      if (a) newAchievements.push(a);
    }
    if (nutritionDays >= 3) {
      const a = await this.award(userId, 'nutrition_tracker');
      if (a) newAchievements.push(a);
    }
    if (shoppingCount >= 5) {
      const a = await this.award(userId, 'shopping_ready');
      if (a) newAchievements.push(a);
    }

    return newAchievements;
  }
};
