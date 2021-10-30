import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';

const invalidUrlHandler: RequestHandler = (req, res, next) => {
  next(createError(404, ERROR.INVALID_URL));
};

export default invalidUrlHandler;
