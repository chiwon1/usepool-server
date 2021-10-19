import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import mongoose from 'mongoose';
import { IRide, IRideModel } from '../types/Ride';
import Ride from '../models/Ride';
import ChatRoom from '../models/ChatRoom';
import { calculateDistance } from '../utils/distance';

export const newRide: RequestHandler = async (req, res, next) => {
  try {
    console.log('!req.body', req.body);
    if (!req.body) {
      return;
    }

    const {
      departureLocation,
      departureAddress,
      departureCoordinate,
      departureDate,
      departureTime,
      destination,
      destinationAddress,
      destinationCoordinate,
    } = req.body as IRide;

    // TODO 2021/10/08 cw: validatorion 로직 middleware로 빼기
    if (!departureLocation) {
      throw createError(400, ERROR.INVALID_DEPART_LOCATION);
    }

    if (!departureTime) {
      throw createError(400, ERROR.INVALID_DEPART_TIME);
    }

    if (!destination) {
      throw createError(400, ERROR.INVALID_ARRIVE_LOCATION);
    }

    await Ride.create({
      departureLocation,
      departureAddress,
      departureCoordinate,
      departureDate,
      departureTime,
      destination,
      destinationAddress,
      destinationCoordinate,
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
    console.log('req.query', req.query);

    const { departureCoordinate, departureDate, destinationCoordinate } =
      req.query;

    const ridesOnDate = await Ride.find({
      departureDate: departureDate as string,
    }).exec();

    await Ride.populate(ridesOnDate, 'driver');

    const adjacentRide: IRideModel[] = [];

    const userDepartureCoordinate = departureCoordinate as string[];
    const userDestinationCoordinate = destinationCoordinate as string[];

    ridesOnDate.forEach((ride) => {
      const departureDistance = calculateDistance(
        userDepartureCoordinate,
        ride.departureCoordinate,
      );

      if (departureDistance > 5) {
        return;
      }

      const destinationDistance = calculateDistance(
        userDestinationCoordinate,
        ride.destinationCoordinate,
      );

      if (destinationDistance <= 5) {
        adjacentRide.push(ride);
      }
    });

    return res
      .status(200)
      .json({ result: 'success', searchResult: adjacentRide });
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
