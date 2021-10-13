import express from 'express';
import { chatList, join, list } from '../services/chatRooms.controller';
const router = express.Router();

router.get('/list', list);
router.get('/:id', join);
router.get('/:id', chatList);

export default router;
