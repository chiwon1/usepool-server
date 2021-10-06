import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import User from '../models/User';
import mongoose from 'mongoose';
import axios from 'axios';
import { IKakaoInfo } from '../types/Kakao';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { kakaoToken } = req.query;

    const { data } = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${String(kakaoToken)}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const { id, properties } = data as unknown as IKakaoInfo;

    const userInfo = {
      kakaoId: id,
      nickname: properties.nickname,
      profilePicture: properties.profile_image,
    };

    const hasLoggedin = await User.exists({
      kakaoId: id,
    });

    if (!hasLoggedin) {
      await User.create({
        ...userInfo,
      });
    }

    const user = await User.findOne({ kakaoId: id });

    if (user) {
      await user.generateToken(userInfo);

      res
        .status(200)
        .cookie('x_auth', user.token)
        .json({ result: 'success', userInfo });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};
