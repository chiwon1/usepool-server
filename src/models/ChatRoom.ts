import mongoose from 'mongoose';
import { IChatRoomModel } from '../types/ChatRoom';

const chatRoomSchema = new mongoose.Schema(
  {
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
    },
    chats: {
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
