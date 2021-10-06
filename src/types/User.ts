import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  kakaoId: number;
  nickname: string;
  profilePicture: string;
  ridesAsDriver: [];
  ridesAsPassenger: [];
  __v: number;
}
