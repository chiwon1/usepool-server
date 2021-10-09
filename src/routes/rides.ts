import express from 'express';
import { newRide, searchRides } from '../services/rides.controller';
import { searchQueryValidator } from '../middlewares/searchQueryValidator';
const router = express.Router();

router.post('/new', newRide);

router.get('/search', searchQueryValidator, searchRides);
// router.delete('/:_id/delete', controller.delete);

export default router;
