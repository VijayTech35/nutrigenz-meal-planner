import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes from backend
import authRoutes from './backend/routes/auth.js';
import userRoutes from './backend/routes/user.js';
import pantryRoutes from './backend/routes/pantry.js';
import recipeRoutes from './backend/routes/recipes.js';
import mealPlanRoutes from './backend/routes/mealPlans.js';
import shoppingListRoutes from './backend/routes/shoppingList.js';
import favoritesRoutes from './backend/routes/favorites.js';
import collectionsRoutes from './backend/routes/collections.js';
import notificationRoutes from './backend/routes/notifications.js';
import nutritionLogRoutes from './backend/routes/nutritionLog.js';
import recentlyViewedRoutes from './backend/routes/recentlyViewed.js';
import achievementRoutes from './backend/routes/achievements.js';
import healthGoalRoutes from './backend/routes/healthGoals.js';
import aiChatRoutes from './backend/routes/aiChat.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/nutrition-log', nutritionLogRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/health-goals', healthGoalRoutes);
app.use('/api/ai', aiChatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'AI Recipe Generator API' });
});

// Export for Vercel
export default app;
