import express from 'express';
import { list } from '../services/chatRooms.controller';
const router = express.Router();

router.get('/list', list);

export default router;
