import express from 'express';
import * as nutritionLogController from '../controllers/nutritionLogController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/today', nutritionLogController.getTodayLog);
router.get('/week', nutritionLogController.getWeekTotals);
router.get('/stats', nutritionLogController.getStats);
router.get('/:date', nutritionLogController.getLogByDate);
router.post('/', nutritionLogController.addLogEntry);
router.delete('/:id', nutritionLogController.deleteLogEntry);
router.delete('/date/:date', nutritionLogController.clearDate);

export default router;
