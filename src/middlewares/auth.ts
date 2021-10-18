import User from '../models/User';
import createError from 'http-errors';
import ERROR from '../constants/error';
import { RequestHandler } from 'express';

export const auth: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw createError(401, ERROR.INVALID_TOKEN);
  }

  try {
    const user = await User.findByToken(token);

    if (!user) {
      throw createError(400, ERROR.INVALID_USER);
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
