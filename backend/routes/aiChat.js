import express from 'express';
import * as aiChatController from '../controllers/aiChatController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/chat', aiChatController.chatWithAI);

export default router;
