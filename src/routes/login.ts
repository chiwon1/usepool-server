import express from 'express';
const router = express.Router();

import { queryValidator } from '../middlewares/queryValidator';
import { login } from '../services/login.controller';

router.post('/', queryValidator, login);

export default router;
