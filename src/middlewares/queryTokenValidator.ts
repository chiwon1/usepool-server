import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import mongoose from 'mongoose';

export const queryTokenValidator: RequestHandler = (req, res, next) => {
  try {
    if (!req.query) {
      throw createError(400, ERROR.INVALID_TOKEN);
    }

    const { kakaoToken } = req.query;

    if (!kakaoToken) {
      throw createError(400, ERROR.INVALID_TOKEN);
    }

    next();
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};
