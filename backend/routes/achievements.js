import express from 'express';
import * as achievementController from '../controllers/achievementController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', achievementController.getAchievements);
router.post('/check', achievementController.checkAchievements);

export default router;
