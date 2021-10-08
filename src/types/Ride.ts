import mongoose from 'mongoose';

export interface IRide {
  departFrom: string;
  departDate: string;
  departTime: string;
  arriveAt: string;
  seatCapacity: number;
  isFullyBooked?: boolean;
  distance?: string;
  driver: mongoose.Schema.Types.ObjectId;
  driverNickname: string;
  passengers?: mongoose.Schema.Types.ObjectId[];
}
