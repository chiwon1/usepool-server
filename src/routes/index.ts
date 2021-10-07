import express from 'express';

import user from './user';
import login from './login';
import logout from './logout';
import rides from './rides';
import auth from '../middlewares/auth';

const router = express.Router();

router.use('/user', auth, user);
router.use('/login', login);
router.use('/logout', auth, logout);
router.use('/rides', rides);

export default router;
