import express from 'express';
import { IUserDocument } from '../types/User';

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const { _id, kakaoId, nickname, profilePicture } =
      req.user as IUserDocument;

    const userInfo = {
      userId: _id,
      nickname,
      profilePicture,
    };

    res.status(200).json({ result: 'success', userInfo });
  } catch (err) {
    next(err);
  }
});

export default router;
