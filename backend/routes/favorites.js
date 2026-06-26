import express from 'express';
import Favorite from '../models/Favorite.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const favorites = await Favorite.findByUserId(req.user.id);
    res.json({ success: true, data: { favorites } });
  } catch (error) {
    next(error);
  }
});

router.post('/:recipeId', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const existing = await Favorite.findByUserAndRecipe(req.user.id, recipeId);
    
    if (existing) {
      return res.status(400).json({ success: false, message: 'Recipe already in favorites' });
    }
    
    const favorite = await Favorite.create(req.user.id, recipeId);
    res.status(201).json({ success: true, data: { favorite } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:recipeId', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    await Favorite.delete(req.user.id, recipeId);
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
});

router.get('/:recipeId/check', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const isFavorite = await Favorite.isFavorite(req.user.id, recipeId);
    res.json({ success: true, data: { isFavorite } });
  } catch (error) {
    next(error);
  }
});

export default router;
