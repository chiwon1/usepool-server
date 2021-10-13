import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import mongoose from 'mongoose';
import { IRide } from '../types/Ride';
import Ride from '../models/Ride';
import User from '../models/User';
import Chat from '../models/Chat';

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

    const { _id } = req.params;

    if (!_id) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    if (!mongoose.isValidObjectId(_id)) {
      return next(createError(400, ERROR.INVALID_DATA));
    }

    const details = await Ride.findOne({ _id }).exec();

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

    const { _id } = req.params;

    if (!_id) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    if (!mongoose.isValidObjectId(_id)) {
      return next(createError(400, ERROR.INVALID_DATA));
    }

    const rideId = _id as unknown as mongoose.Schema.Types.ObjectId;
    const userId = req.user?._id;

    const targetRide = await Ride.findOne({ rideId }).exec();

    if (!targetRide) {
      return next(createError(400, ERROR.INVALID_RIDE));
    }

    targetRide.passengers = [...targetRide.passengers, userId];

    await targetRide.save();

    const targetUser = req.user;

    targetUser.ridesAsPassenger = [...targetUser.ridesAsPassenger, rideId];

    await targetUser.save();

    return res.status(200).json({ result: 'success' });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

export const getChats: RequestHandler = async (req, res, next) => {
  try {
    const ride = await Ride.findOne({ _id: req.params.rideId });

    if (!ride) {
      return res.status(404).send('존재하지 않는 ride입니다.');
    }

    await Ride.populate(ride, 'chats');

    const chats = ride.chats;

    return res.status(200).json({ result: 'success', chats });
  } catch (err) {
    console.log('err here', err);

    next(err);
  }
};

export const postChats: RequestHandler = async (req, res, next) => {
  try {
    const ride = await Ride.findOne({ _id: req.params.rideId });

    if (!ride) {
      return res.status(404).send('존재하지 않는 ride입니다.');
    }

    const senderId = req.user?.id;

    const sender = await User.findOne({ _id: senderId });

    console.log('req.body', req.body);

    const chat = new Chat({
      sender: senderId,
      senderNickname: sender!.nickname,
      senderProfilePicture: sender!.profilePicture,
      contents: req.body.contents,
    });

    await chat.save();

    ride.chats = [...ride.chats, chat._id];

    await ride.save();

    const chatWithSender = await Chat.findOne({
      sender: senderId,
    });

    const rideId = ride._id as string;

    const io = req.app.get('io');

    io.of(`/${rideId}`).emit('dm', chatWithSender);

    // io.of(`/${ride._id}`).to(ride._id).emit('dm', chatWithSender);

    return res.send('ok');
  } catch (err) {
    console.log('err here', err);

    next(err);
  }
};
