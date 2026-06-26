import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import pantryRoutes from './routes/pantry.js';
import recipeRoutes from './routes/recipes.js';
import mealPlanRoutes from './routes/mealPlans.js';
import shoppingListRoutes from './routes/shoppingList.js';
import favoritesRoutes from './routes/favorites.js';
import collectionsRoutes from './routes/collections.js';
import notificationRoutes from './routes/notifications.js';
import nutritionLogRoutes from './routes/nutritionLog.js';
import recentlyViewedRoutes from './routes/recentlyViewed.js';
import achievementRoutes from './routes/achievements.js';
import healthGoalRoutes from './routes/healthGoals.js';
import aiChatRoutes from './routes/aiChat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5180',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ];
    
    const isVercelDomain = origin && /\.vercel\.app$/.test(origin);
    const isRenderDomain = origin && /\.onrender\.com$/.test(origin);
    
    if (!origin || allowedOrigins.includes(origin) || isVercelDomain || isRenderDomain) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

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

// Serve index.html for all non-API routes in production (SPA fallback)
if (process.env.NODE_ENV === 'production') {
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || process.env.VERCEL_DEV_PORT || 8000;

app.listen(PORT, () => {
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server running on port ${PORT}`);
});

export default app;
