import express from 'express';
import {
  book,
  newChatRoom,
  details,
  newRide,
  searchRides,
} from '../services/rides.controller';
import { searchQueryValidator } from '../middlewares/searchQueryValidator';
const router = express.Router();

router.post('/new', newRide);
router.get('/search', searchQueryValidator, searchRides);
router.get('/:id', details);
router.post('/:id', book);
router.post('/:id/newChatRoom', newChatRoom);

export default router;
