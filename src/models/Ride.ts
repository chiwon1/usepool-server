import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema(
  {
    isFullyBooked: {
      type: Boolean,
    },
    departFrom: {
      type: String,
      required: true,
    },
    departTime: {
      type: Date,
      required: true,
    },
    arriveAt: {
      type: String,
      required: true,
    },
    arriveTime: {
      type: Date,
      required: true,
    },
    distance: {
      type: String,
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
    capacity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Ride', rideSchema);
