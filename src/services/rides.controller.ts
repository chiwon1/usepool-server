import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import Ride from '../models/Ride';
import mongoose from 'mongoose';
import { IRide } from '../types/IRide';

export const newRide: RequestHandler = async (req, res, next) => {
  // if (!req.user) {
  //   return console.log('no auth');
  // }

  try {
    if (!req.body) {
      return;
    }

    const { departFrom, departTime, arriveAt, arriveTime, capacity } =
      req.body as IRide;

    if (!departFrom) {
      throw createError(400, ERROR.INVALID_DEPART_LOCATION);
    }

    if (!departTime) {
      throw createError(400, ERROR.INVALID_DEPART_TIME);
    }

    if (!arriveAt) {
      throw createError(400, ERROR.INVALID_ARRIVE_LOCATION);
    }

    if (!arriveTime) {
      throw createError(400, ERROR.INVALID_ARRIVE_TIME);
    }

    if (!capacity) {
      throw createError(400, ERROR.INVALID_CAPACITY);
    }

    await Ride.create({
      departFrom,
      departTime,
      arriveAt,
      arriveTime,
      capacity,
    });

    return res.status(200).json({ result: 'success' });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};
