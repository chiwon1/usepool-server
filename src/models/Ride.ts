import mongoose from 'mongoose';
import { IRideModel } from '../types/Ride';

const rideSchema = new mongoose.Schema(
  {
    departFrom: {
      type: String,
      required: true,
    },
    departDate: {
      type: String,
      required: true,
    },
    departTime: {
      type: String,
      required: true,
    },
    arriveAt: {
      type: String,
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    passengers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    chatRooms: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ChatRoom',
        },
      ],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IRideModel>('Ride', rideSchema);
