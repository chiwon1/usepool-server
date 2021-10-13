import express from 'express';
import {
  book,
  details,
  getChats,
  newRide,
  postChats,
  searchRides,
} from '../services/rides.controller';
import { searchQueryValidator } from '../middlewares/searchQueryValidator';
import Ride from '../models/Ride';
import Chat from '../models/Chat';
import User from '../models/User';
const router = express.Router();

router.post('/new', newRide);
router.get('/search', searchQueryValidator, searchRides);
router.get('/:_id', details);
router.post('/:_id', book);
router.get('/:rideId/chats/:userId', getChats);
router.post('/:rideId/chats/:userId', postChats);

// router.delete('/:_id/delete', controller.delete);
//
// router.get('/:rideId/chats/:userId', async (req, res, next) => {
//   try {
//     const ride = await Ride.findOne({ _id: req.params.rideId });
//
//     if (!ride) {
//       return res.status(404).send('존재하지 않는 ride입니다.');
//     }
//
//     await Ride.populate(ride, 'chats');
//
//     const chats = ride.chats;
//
//     return res.status(200).json({ result: 'success', chats });
//   } catch (err) {
//     console.log('err here', err);
//
//     next(err);
//   }
// });
//
// router.post('/:rideId/chats/:userId', async (req, res, next) => {
//   try {
//     const ride = await Ride.findOne({ _id: req.params.rideId });
//
//     if (!ride) {
//       return res.status(404).send('존재하지 않는 ride입니다.');
//     }
//
//     const senderId = req.user?.id;
//
//     const sender = await User.findOne({ _id: senderId });
//
//     console.log('req.body', req.body);
//
//     const chat = new Chat({
//       sender: senderId,
//       senderNickname: sender!.nickname,
//       senderProfilePicture: sender!.profilePicture,
//       contents: req.body.contents,
//     });
//
//     await chat.save();
//
//     ride.chats = [...ride.chats, chat._id];
//
//     await ride.save();
//
//     const chatWithSender = await Chat.findOne({
//       sender: senderId,
//     });
//
//     const rideId = ride._id as string;
//
//     const io = req.app.get('io');
//
//     io.of(`/${rideId}`).emit('dm', chatWithSender);
//
//     // io.of(`/${ride._id}`).to(ride._id).emit('dm', chatWithSender);
//
//     return res.send('ok');
//   } catch (err) {
//     console.log('err here', err);
//
//     next(err);
//   }
// });

export default router;
