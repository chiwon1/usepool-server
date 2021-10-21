import express from 'express';
import { newChat } from '../services/chats.controller';
const router = express.Router();

router.post('/:id', newChat);

export default router;
