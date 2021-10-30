import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import mongoose from 'mongoose';
import { ICoordinate, IRide, IRideModel } from '../types/Ride';
import Ride from '../models/Ride';
import ChatRoom from '../models/ChatRoom';
import { calculateDistance } from '../utils/distance';

export const newRide: RequestHandler = async (req, res, next) => {
  try {
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
    const { departureCoordinate, destinationCoordinate, departureDate } =
      req.query;

    if (!Array.isArray(departureCoordinate)) {
      throw createError(400, ERROR.INVALID_DEPARTURE_COORDINATE);
    }

    if (!Array.isArray(destinationCoordinate)) {
      throw createError(400, ERROR.INVALID_DESTINATION_COORDINATE);
    }

    const ridesOnDate = await Ride.find({
      departureDate: departureDate as string,
    }).exec();

    await Ride.populate(ridesOnDate, 'driver');

    const adjacentRide: IRideModel[] = [];

    const userDepartureCoordinate: ICoordinate = {
      lat: Number(departureCoordinate[0]),
      lng: Number(departureCoordinate[1]),
    };

    const userDestinationCoordinate: ICoordinate = {
      lat: Number(destinationCoordinate[0]),
      lng: Number(destinationCoordinate[1]),
    };

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
