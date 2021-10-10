import express from 'express';
import {
  bookRide,
  getDetails,
  newRide,
  searchRides,
} from '../services/rides.controller';
import { searchQueryValidator } from '../middlewares/searchQueryValidator';
const router = express.Router();

router.post('/new', newRide);

router.get('/search', searchQueryValidator, searchRides);
router.get('/:_id', getDetails);
router.post('/:_id', bookRide);
// router.delete('/:_id/delete', controller.delete);

export default router;
