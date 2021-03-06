import { RequestHandler } from 'express';
import createError from 'http-errors';
import ERROR from '../constants/error';
import User from '../models/User';
import mongoose from 'mongoose';
import axios, { AxiosResponse } from 'axios';
import { IKakaoAuth, IKakaoUserInfo } from '../types/Kakao';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { authCode } = req.query;

    const {
      data: { access_token },
    }: AxiosResponse<IKakaoAuth> = await axios({
      method: 'post',
      url: `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process
        .env.KAKAO_CLIENT_ID!}&redirect_uri=${process.env
        .KAKAO_REDIRECT_URI!}&code=${String(authCode)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const {
      data: {
        id,
        properties: { nickname, profile_image },
      },
    }: AxiosResponse<IKakaoUserInfo> = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${String(access_token)}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const kakaoUserInfo = {
      kakaoId: id,
      nickname: nickname,
      profilePicture: profile_image,
    };

    const hasLoggedin = await User.exists({
      kakaoId: id,
    });

    if (!hasLoggedin) {
      await User.create({
        ...kakaoUserInfo,
        kakaoToken: access_token,
      });
    }

    const user = await User.findOneAndUpdate(
      { kakaoId: id },
      { kakaoToken: access_token },
    ).exec();

    if (!user) {
      throw createError(400, ERROR.INVALID_USER);
    }

    await user.generateToken(kakaoUserInfo);

    const userInfo = {
      userId: user.id,
      nickname: user.nickname,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({ result: 'success', userInfo, token: user.token });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(createError(400, ERROR.INVALID_DATA));
    }

    next(err);
  }
};
