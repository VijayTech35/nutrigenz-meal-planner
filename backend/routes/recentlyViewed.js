import express from 'express';
import * as recentlyViewedController from '../controllers/recentlyViewedController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', recentlyViewedController.getRecentlyViewed);
router.post('/', recentlyViewedController.addRecentlyViewed);
router.delete('/', recentlyViewedController.clearRecentlyViewed);

export default router;
