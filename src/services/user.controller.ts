import { RequestHandler } from 'express';
import { IUserDocument } from '../types/User';

export const info: RequestHandler = (req, res, next) => {
  try {
    const { _id, nickname, profilePicture } = req.user as IUserDocument;

    const userInfo = {
      userId: _id,
      nickname,
      profilePicture,
    };

    res.status(200).json({ result: 'success', userInfo });
  } catch (err) {
    next(err);
  }
};
