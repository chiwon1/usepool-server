import express from 'express';
const router = express.Router();

import { queryTokenValidator } from '../middlewares/queryTokenValidator';
import { login } from '../services/login.controller';

router.post('/', queryTokenValidator, login);

// router.get('/:_id', controller.get);
// router.delete('/:_id/delete', controller.delete);

export default router;
