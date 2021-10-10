import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import User from '../models/User';
import mongoose from 'mongoose';
import axios from 'axios';
import { IKakaoInfo } from '../types/Kakao';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { authCode } = req.query;

    const kakaoResponse = await axios({
      method: 'post',
      url: `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process
        .env.KAKAO_CLIENT_ID!}&redirect_uri=${process.env
        .KAKAO_REDIRECT_URI!}&code=${String(authCode)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const { access_token } = kakaoResponse.data;

    const { data } = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${String(access_token)}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const { id, properties } = data as unknown as IKakaoInfo;

    const userInfo = {
      kakaoId: id,
      nickname: properties.nickname,
      profilePicture: properties?.profile_image,
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

    if (!user) {
      throw createError(400, ERROR.INVALID_USER);
    }

    await user.generateToken(userInfo);

    res
      .status(200)
      .cookie('x_auth', user.token)
      .json({ result: 'success', userInfo });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};
