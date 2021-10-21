import mongoose from 'mongoose';
import { IRide, IRideModel } from '../types/Ride';

const rideSchema = new mongoose.Schema(
  {
    departureLocation: {
      type: String,
      required: true,
    },
    departureAddress: {
      type: String,
      required: true,
    },
    departureCoordinate: {
      type: {
        lat: Number,
        lng: Number,
      },
      required: true,
    },
    departureDate: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    destinationAddress: {
      type: String,
      required: true,
    },
    destinationCoordinate: {
      type: {
        lat: Number,
        lng: Number,
      },
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
