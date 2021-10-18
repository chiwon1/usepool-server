import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';

export const searchQueryValidator: RequestHandler = (req, res, next) => {
  try {
    if (!req.query) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    const { departFrom, arriveAt, departDate } = req.query;

    if (!departFrom) {
      throw createError(400, ERROR.INVALID_DEPART_LOCATION);
    }

    if (!arriveAt) {
      throw createError(400, ERROR.INVALID_ARRIVE_LOCATION);
    }

    if (!departDate) {
      throw createError(400, ERROR.INVALID_DEPART_DATE);
    }

    next();
  } catch (err) {
    next(err);
  }
};
