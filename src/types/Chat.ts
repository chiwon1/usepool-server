import mongoose, { Document } from 'mongoose';

export interface IChat {
  senderId: mongoose.Schema.Types.ObjectId;
  senderNickname: string;
  senderProfilePicture: string;
  contents: string;
}

export interface IChatModel extends IChat, Document {}
