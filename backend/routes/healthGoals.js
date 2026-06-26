import express from 'express';
import * as healthGoalController from '../controllers/healthGoalController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', healthGoalController.getHealthGoals);
router.post('/', healthGoalController.saveHealthGoals);
router.post('/calculate-tdee', healthGoalController.calculateTDEE);
router.delete('/', healthGoalController.deleteHealthGoals);

export default router;
