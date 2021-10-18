import express from 'express';
const router = express.Router();

import { authCodeValidator } from '../middlewares/authCodeValidator';
import { login } from '../services/login.controller';

router.post('/', authCodeValidator, login);

export default router;
