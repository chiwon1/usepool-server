import mongoose from 'mongoose';
import { IChatRoomModel } from '../types/ChatRoom';

const chatRoomSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Ride',
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: Boolean,
      required: true,
    },
    chatList: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chat',
        },
      ],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IChatRoomModel>('ChatRoom', chatRoomSchema);
