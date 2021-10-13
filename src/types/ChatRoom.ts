import mongoose, { Document } from 'mongoose';

export interface IChatRoom {
  driver: mongoose.Schema.Types.ObjectId;
  ride: mongoose.Schema.Types.ObjectId;
  passenger: mongoose.Schema.Types.ObjectId;
  status: boolean;
  chats: mongoose.Schema.Types.ObjectId[];
}

export interface IChatRoomModel extends IChatRoom, Document {}
