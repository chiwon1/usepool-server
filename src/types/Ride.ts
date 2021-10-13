import mongoose, { Document } from 'mongoose';

export interface IRide {
  departFrom: string;
  departDate: string;
  departTime: string;
  arriveAt: string;
  seatCapacity: number;
  driver: mongoose.Schema.Types.ObjectId;
  passengers: mongoose.Schema.Types.ObjectId[];
  chatRooms: mongoose.Schema.Types.ObjectId[];
}

export interface IRideModel extends IRide, Document {}
