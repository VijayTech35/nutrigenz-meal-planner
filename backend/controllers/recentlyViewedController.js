import RecentlyViewed from '../models/RecentlyViewed.js';

export const getRecentlyViewed = async (req, res, next) => {
  try {
    const items = await RecentlyViewed.findByUserId(req.user.id);
    res.json({ success: true, data: { items } });
  } catch (error) {
    next(error);
  }
};

export const addRecentlyViewed = async (req, res, next) => {
  try {
    const { recipeId } = req.body;
    await RecentlyViewed.add(req.user.id, recipeId);
    res.json({ success: true, message: 'Added to recently viewed' });
  } catch (error) {
    next(error);
  }
};

export const clearRecentlyViewed = async (req, res, next) => {
  try {
    await RecentlyViewed.clear(req.user.id);
    res.json({ success: true, message: 'Recently viewed cleared' });
  } catch (error) {
    next(error);
  }
};
