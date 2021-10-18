import { RequestHandler } from 'express';
import createError from 'http-errors';

const invalidUrlHandler: RequestHandler = (req, res, next) => {
  next(createError(404));
};

export default invalidUrlHandler;
