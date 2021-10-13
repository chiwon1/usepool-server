import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  kakaoId: number;
  nickname: string;
  profilePicture?: string;
  ridesAsPassenger: mongoose.Schema.Types.ObjectId[];
  token?: string;
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Schema.Types.ObjectId;
  generateToken: (
    payload: string | Buffer | Record<string, unknown>,
  ) => Promise<void>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByToken: (token: string) => Promise<IUserDocument>;
}

export interface IDecoded {
  kakaoId: number;
  nickname: string;
  profilePicture: string;
  iat: number;
  exp: number;
}
