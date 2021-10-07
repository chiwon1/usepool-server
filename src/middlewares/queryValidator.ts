import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import mongoose from 'mongoose';

export const queryValidator: RequestHandler = (req, res, next) => {
  try {
    if (!req.query) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    const { authCode } = req.query;

    if (!authCode) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    next();
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};
