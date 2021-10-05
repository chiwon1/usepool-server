import express from 'express';
import { newRide } from '../services/rides.controller';
const router = express.Router();

router.post('/new', newRide);

// router.get('/:_id', controller.get);
// router.delete('/:_id/delete', controller.delete);

export default router;
