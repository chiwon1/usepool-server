import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';

import ERROR from '../constants/error';
import ChatRoom from '../models/ChatRoom';

export const list: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId)) {
      next(createError(400, ERROR.INVALID_USER));
    }

    const listAsPassenger = await ChatRoom.find({ passenger: userId });
    const listAsDriver = await ChatRoom.find({ driver: userId });

    const chatRoomList = [...listAsPassenger, ...listAsDriver];

    res.status(200).json({ result: 'success', chatRoomList });
  } catch (err) {
    next(err);
  }
};
