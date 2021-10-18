import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import mongoose from 'mongoose';
import Ride from '../models/Ride';

export const asDriver: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    const rides = await Ride.find({ driver: user._id });

    await Ride.populate(rides, 'driver');

    return res.status(200).json({ result: 'success', rides });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

export const asPassenger: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    const ridesAsPassenger = user?.ridesAsPassenger;

    const rides = await Ride.find().where('_id').in(ridesAsPassenger).exec();

    await Ride.populate(rides, 'driver');

    return res.status(200).json({ result: 'success', rides });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};
