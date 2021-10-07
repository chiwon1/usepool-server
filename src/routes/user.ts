import express from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import User, { IUserDocument } from '../models/User';
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  try {
    const { kakaoId, nickname, profilePicture } = req.user as IUserDocument;

    const userInfo = {
      kakaoId,
      nickname,
      profilePicture,
    };

    res.status(200).json(userInfo);
  } catch (err) {
    next(err);
  }
});

export default router;
