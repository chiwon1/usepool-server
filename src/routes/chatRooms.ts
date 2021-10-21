import express from 'express';
import { chatList, info, list } from '../services/chatRooms.controller';
const router = express.Router();

router.get('/list', list);
router.get('/:id', chatList);
router.get('/:id/info', info);

export default router;
