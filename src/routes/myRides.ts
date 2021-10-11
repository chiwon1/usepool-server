import express from 'express';
import { asDriver, asPassenger } from '../services/myRides.controller';

const router = express.Router();

router.get('/asDriver', asDriver);
router.get('/asPassenger', asPassenger);

export default router;
