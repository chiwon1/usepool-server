import express from 'express';
const router = express.Router();

import { logout } from '../services/logout.controller';

router.post('/', logout);

export default router;
