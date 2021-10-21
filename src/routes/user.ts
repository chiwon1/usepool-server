import express from 'express';
import { info } from '../services/user.controller';

const router = express.Router();

router.get('/', info);

export default router;
