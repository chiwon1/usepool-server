import express from 'express';
import { IUserDocument } from '../models/User';
const router = express.Router();

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
