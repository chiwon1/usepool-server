import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import ERROR from '../constants/error';
import { IDecoded, IUserDocument, IUserModel } from '../types/User';

const userSchema = new mongoose.Schema({
  kakaoId: {
    type: Number,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  ridesAsPassenger: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
      },
    ],
  },
  token: String,
  kakaoToken: String,
});

userSchema.methods.generateToken = async function (
  payload: string | Buffer | Record<string, unknown>,
): Promise<void> {
  const user = this as IUserDocument;

  try {
    user.token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: '7d',
    });

    await user.save();
  } catch (err) {
    throw createError(500, ERROR.INTERNAL_SERVER_ERROR);
  }
};

userSchema.statics.findByToken = async function (token: string) {
  const user = this as IUserModel;

  try {
    const { kakaoId } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!,
    ) as IDecoded;

    return await user.findOne({ kakaoId, token });
  } catch (err) {
    throw createError(400, ERROR.INVALID_USER);
  }
};

export default mongoose.model<IUserDocument, IUserModel>('User', userSchema);
