import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import mongoose from 'mongoose';
import Ride from '../models/Ride';

export const asDriver: RequestHandler = async (req, res, next) => {
  try {
    const targetUser = req.user;

    const rides = await Ride.find({ driver: targetUser!._id });

    console.log('rides', rides);

    return res.status(200).json({ result: 'success', rides });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};

export const asPassenger: RequestHandler = (req, res, next) => {
  try {
    return res.status(200).json({ result: 'success' });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};
