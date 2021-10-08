import mongoose from 'mongoose';

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
    seatCapacity: {
      type: Number,
      required: true,
    },
    isFullyBooked: {
      type: Boolean,
    },
    distance: {
      type: String,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driverNickname: {
      type: String,
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
  },
  { timestamps: true },
);

export default mongoose.model('Ride', rideSchema);
