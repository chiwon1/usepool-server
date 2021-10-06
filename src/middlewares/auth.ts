import User from '../models/User';
import createError from 'http-errors';
import ERROR from '../constants/error';
import { RequestHandler } from 'express';
import { ICookies } from '../types/express';

export const auth: RequestHandler = async (req, res, next) => {
  const token = (req.cookies as ICookies).x_auth;

  if (!token) {
    return next(createError(400, ERROR.INVALID_TOKEN));
  }

  try {
    const user = await User.findByToken(token);

    if (!user) {
      return next(createError(400, ERROR.INVALID_USER));
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
