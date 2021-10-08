import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import Ride from '../models/Ride';
import mongoose from 'mongoose';
import { IRide } from '../types/Ride';

export const newRide: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body) {
      return;
    }

    const {
      departFrom,
      departDate,
      departTime,
      arriveAt,
      seatCapacity,
      driverNickname,
    } = req.body as IRide;

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

    if (!driverNickname) {
      throw createError(400, ERROR.INVALID_DRIVER_NICKNAME);
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
      driverNickname,
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
