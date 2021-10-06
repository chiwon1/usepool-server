import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  kakaoId: {
    type: Number,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  ridesAsDriver: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
      },
    ],
  },
  ridesAsPassenger: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
      },
    ],
  },
});

export default mongoose.model('User', userSchema);
