import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  firebaseId: {
    type: String,
    required: true,
    unique: true,
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
