import express from 'express';
import { sendMessage, getChatHistory, markAsRead } from '../controllers/messageController.js';

const router = express.Router();

// Routes
router.post('/send', sendMessage);
router.get('/history', getChatHistory);
router.post('/mark-read', markAsRead);

export default router;