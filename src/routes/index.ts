import express from 'express';

import user from './user';
import login from './login';
import logout from './logout';
import rides from './rides';
import myRides from './myRides';
import auth from '../middlewares/auth';
import chatRooms from './chatRooms';

const router = express.Router();

router.use('/user', auth, user);
router.use('/login', login);
router.use('/logout', auth, logout);
router.use('/rides', auth, rides);
router.use('/myRides', auth, myRides);
router.use('/chatRooms', auth, chatRooms);

export default router;
