import mongoose from 'mongoose';
import { IRideModel } from '../types/Ride';

const rideSchema = new mongoose.Schema(
  {
    departLocation: {
      type: String,
      required: true,
    },
    departAddress: String,
    departCoordinate: [Number],
    departDate: {
      type: String,
      required: true,
    },
    departTime: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    destinationAddress: String,
    destinationCoordinate: [Number],
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
