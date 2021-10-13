import express from 'express';
import {
  book,
  details,
  joinChat,
  // getChats,
  newRide,
  // postChats,
  searchRides,
} from '../services/rides.controller';
import { searchQueryValidator } from '../middlewares/searchQueryValidator';
const router = express.Router();

router.post('/new', newRide);
router.get('/search', searchQueryValidator, searchRides);
router.get('/:id', details);
router.post('/:id', book);
router.post('/:id/joinChat', joinChat);
// router.get('/:rideId/chats/:userId', getChats);
// router.post('/:rideId/chats/:userId', postChats);

export default router;
