import express from 'express';
import Collection from '../models/Collection.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const collections = await Collection.findByUserId(req.user.id);
    res.json({ success: true, data: { collections } });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Collection name is required' });
    }
    const collection = await Collection.create(req.user.id, { name, description });
    res.status(201).json({ success: true, data: { collection } });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const collection = await Collection.update(id, req.user.id, { name, description });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, data: { collection } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await Collection.delete(id, req.user.id);
    res.json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/recipes', async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipes = await Collection.getRecipesInCollection(id, req.user.id);
    res.json({ success: true, data: { recipes } });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/recipes/:recipeId', async (req, res, next) => {
  try {
    const { id, recipeId } = req.params;
    await Collection.addRecipe(id, req.user.id, recipeId);
    res.json({ success: true, message: 'Recipe added to collection' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/recipes/:recipeId', async (req, res, next) => {
  try {
    const { id, recipeId } = req.params;
    await Collection.removeRecipe(id, req.user.id, recipeId);
    res.json({ success: true, message: 'Recipe removed from collection' });
  } catch (error) {
    next(error);
  }
});

export default router;
