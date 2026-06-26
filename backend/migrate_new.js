import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running new tables migration...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        link TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

      CREATE TABLE IF NOT EXISTS nutrition_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        log_date DATE NOT NULL DEFAULT CURRENT_DATE,
        meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
        recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
        recipe_name VARCHAR(255),
        servings INT DEFAULT 1,
        calories INT DEFAULT 0,
        protein DECIMAL(10,2) DEFAULT 0,
        carbs DECIMAL(10,2) DEFAULT 0,
        fats DECIMAL(10,2) DEFAULT 0,
        fiber DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_nutrition_log_user_date ON nutrition_log(user_id, log_date);

      CREATE TABLE IF NOT EXISTS recently_viewed (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, recipe_id)
      );
      CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON recently_viewed(user_id, viewed_at DESC);

      CREATE TABLE IF NOT EXISTS user_achievements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        achievement_key VARCHAR(100) NOT NULL,
        xp_awarded INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, achievement_key)
      );
      CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

      CREATE TABLE IF NOT EXISTS health_goals (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        goal_type VARCHAR(50) DEFAULT 'maintain',
        age INT,
        gender VARCHAR(20),
        weight DECIMAL(10,2),
        height DECIMAL(10,2),
        activity_level VARCHAR(50) DEFAULT 'moderate',
        target_calories INT DEFAULT 2000,
        target_protein INT DEFAULT 50,
        target_carbs INT DEFAULT 250,
        target_fats INT DEFAULT 65,
        meals_per_day INT DEFAULT 3,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id)
      );
    `);

    console.log('New tables created successfully!');
    console.log(' - notifications');
    console.log(' - nutrition_log');
    console.log(' - recently_viewed');
    console.log(' - user_achievements');
    console.log(' - health_goals');

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
