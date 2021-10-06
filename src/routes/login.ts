import express from 'express';
const router = express.Router();

import { queryTokenValidator } from '../middlewares/queryTokenValidator';
import { login } from '../services/login.controller';

router.post('/', queryTokenValidator, login);

export default router;
