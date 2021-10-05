import mongoose from 'mongoose';

export interface IRide {
  departFrom: string;
  departTime: Date;
  arriveAt: string;
  arriveTime: string;
  capacity: number;
  isFullyBooked?: boolean;
  distance?: string;
  driver?: mongoose.Schema.Types.ObjectId;
  passengers?: mongoose.Schema.Types.ObjectId[];
}