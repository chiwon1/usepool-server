import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';

import User from '../models/User';
import ERROR from '../constants/error';
import axios from 'axios';

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v1/user/logout',
      headers: {
        Authorization: `Bearer ${req.token!}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

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
