import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';

export const searchQueryValidator: RequestHandler = (req, res, next) => {
  try {
    if (!req.query) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    const { departureCoordinate, departureDate, destinationCoordinate } =
      req.query;

    if (!departureCoordinate) {
      throw createError(400, ERROR.INVALID_DEPART_LOCATION);
    }

    if (!departureDate) {
      throw createError(400, ERROR.INVALID_DEPART_DATE);
    }

    if (!destinationCoordinate) {
      throw createError(400, ERROR.INVALID_ARRIVE_LOCATION);
    }

    next();
  } catch (err) {
    next(err);
  }
};
