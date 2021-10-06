import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';

import User from '../models/User';
import ERROR from '../constants/error';

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const _id = req.user?._id;

    if (!mongoose.isValidObjectId(_id)) {
      next(createError(400, ERROR.INVALID_USER));
    }

    await User.findOneAndUpdate({ _id }, { token: '' });

    res.status(200).json({ result: 'success' });
  } catch (err) {
    next(err);
  }
};
