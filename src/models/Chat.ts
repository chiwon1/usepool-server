import mongoose from 'mongoose';
import { IChatModel } from '../types/Chat';

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    senderNickname: {
      type: String,
      required: true,
    },
    senderProfilePicture: {
      type: String,
    },
    contents: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IChatModel>('Chat', chatSchema);
