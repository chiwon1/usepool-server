import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import createError from 'http-errors';

import User from '../models/User';
import ERROR from '../constants/error';

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user?._id;

    if (!mongoose.isValidObjectId(id)) {
      next(createError(400, ERROR.INVALID_USER));
    }

    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      return next(createError(400, ERROR.INVALID_USER));
    }

    await axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v1/user/logout',
      headers: {
        Authorization: `Bearer ${String(user.kakaoToken)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    await User.findOneAndUpdate({ _id: id }, { token: '', kakaoToken: '' });

    res.status(200).json({ result: 'success' });
  } catch (err) {
    next(err);
  }
};
