import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import mongoose from 'mongoose';
import { IRide } from '../types/Ride';
import Ride from '../models/Ride';
import User from '../models/User';
import Chat from '../models/Chat';
import ChatRoom from '../models/ChatRoom';
import { Server, Socket } from 'socket.io';

export const newRide: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body) {
      return;
    }

    const { departFrom, departDate, departTime, arriveAt, seatCapacity } =
      req.body as IRide;

    // TODO 2021/10/08 cw: validatorion 로직 middleware로 빼기
    if (!departFrom) {
      throw createError(400, ERROR.INVALID_DEPART_LOCATION);
    }

    if (!departTime) {
      throw createError(400, ERROR.INVALID_DEPART_TIME);
    }

    if (!arriveAt) {
      throw createError(400, ERROR.INVALID_ARRIVE_LOCATION);
    }

    if (!seatCapacity) {
      throw createError(400, ERROR.INVALID_CAPACITY);
    }

    await Ride.create({
      departFrom,
      departDate,
      departTime,
      arriveAt,
      seatCapacity,
      driver: req?.user?._id,
    });

    return res.status(200).json({ result: 'success' });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

export const searchRides: RequestHandler = async (req, res, next) => {
  try {
    const { departFrom, arriveAt, departDate } = req.query;

    const searchResult = await Ride.find({
      departFrom: departFrom as string,
      arriveAt: arriveAt as string,
      departDate: departDate as string,
    }).exec();

    const populatedResult = await Ride.populate(searchResult, 'driver');

    return res
      .status(200)
      .json({ result: 'success', searchResult: populatedResult });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

export const details: RequestHandler = async (req, res, next) => {
  try {
    if (!req.params) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    const { id } = req.params;

    if (!id) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, ERROR.INVALID_DATA));
    }

    const details = await Ride.findOne({ _id: id }).exec();

    await Ride.populate(details, 'driver');

    return res.status(200).json({ result: 'success', details });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

export const book: RequestHandler = async (req, res, next) => {
  try {
    if (!req.params) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    const { id: rideId } = req.params;

    if (!rideId) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    if (!mongoose.isValidObjectId(rideId)) {
      return next(createError(400, ERROR.INVALID_DATA));
    }

    const userId = req.user?._id;
    const targetUser = req.user;
    const targetRide = await Ride.findOne({ _id: rideId }).exec();

    if (!targetRide) {
      return next(createError(400, ERROR.INVALID_RIDE));
    }

    targetRide.passengers = [...targetRide.passengers, userId];
    targetUser.ridesAsPassenger = [...targetUser.ridesAsPassenger, rideId];

    // TODO 2021/10/13 cw: PromiseAll로 리팩토링
    await targetRide.save();
    await targetUser.save();

    return res.status(200).json({ result: 'success' });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

export const newChatRoom: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    const userId = req.user?._id;
    const user = req.user;
    const { id: rideId } = req.params;

    if (!mongoose.isValidObjectId(rideId)) {
      return next(createError(400, ERROR.INVALID_DATA));
    }

    const ride = await Ride.findOne({ _id: rideId }).exec();

    if (!ride) {
      return next(createError(400, ERROR.INVALID_RIDE));
    }

    const chatRoom = await ChatRoom.findOne({
      ride: ride._id,
      passenger: userId,
    });

    if (chatRoom) {
      return res.status(200).json({ result: 'success', roomId: chatRoom._id });
    } else {
      const newChatRoom = new ChatRoom({
        ride: rideId,
        driver: ride.driver,
        passenger: userId,
        status: false,
        chat: [],
      });

      ride.chatRooms = [...ride.chatRooms, newChatRoom._id];

      // TODO 2021/10/13 cw: PromiseAll로 리팩토링
      await newChatRoom.save();
      await ride.save();

      return res
        .status(200)
        .json({ result: 'success', roomId: newChatRoom._id });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

export const joinChat: RequestHandler = async (req, res, next) => {
  try {
    if (!req.params) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    const { id: rideId } = req.params;

    if (!rideId) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    if (!mongoose.isValidObjectId(rideId)) {
      return next(createError(400, ERROR.INVALID_DATA));
    }

    const userId = req.user?._id;
    const user = req.user;
    const ride = await Ride.findOne({ _id: rideId }).exec();

    if (!ride) {
      return next(createError(400, ERROR.INVALID_RIDE));
    }

    const oldChatRoom = await ChatRoom.findOne({
      ride: ride._id,
      passenger: userId,
    });

    const joinRoom = () => {
      const io: Server = req.app.get('io');

      io.on('connection', (socket: Socket) => {
        console.log('connected');

        socket.on('join-room', async (roomid) => {
          console.log('room joined');
          await socket.join(roomid);

          socket.on('chat', (chat: string) => {
            console.log('chat', chat);
          });

          io.to(roomid).emit('hello', 'world');

          socket.on('disconnect', () => {
            console.log('disconnect');
          });
        });
      });
    };

    if (oldChatRoom) {
      joinRoom();

      return res
        .status(200)
        .json({ result: 'success', roomId: oldChatRoom._id });
    } else {
      const chatRoom = new ChatRoom({
        ride: rideId,
        driver: ride.driver,
        passenger: userId,
        status: false,
        chat: [],
      });

      const chatRoomId = chatRoom._id;

      ride.chatRooms = [...ride.chatRooms, chatRoom._id];

      // TODO 2021/10/13 cw: PromiseAll로 리팩토링
      await chatRoom.save();
      await ride.save();

      joinRoom();

      return res.status(200).json({ result: 'success', roomId: chatRoomId });
    }

    // io.of(`/${rideId}`).emit('dm', chatWithSender);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

//
// export const getChats: RequestHandler = async (req, res, next) => {
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
// };
//
// export const postChats: RequestHandler = async (req, res, next) => {
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
// };
