import express from 'express';
import { join, list } from '../services/chatRooms.controller';
const router = express.Router();

router.get('/list', list);
router.get('/:id', join);

export default router;
