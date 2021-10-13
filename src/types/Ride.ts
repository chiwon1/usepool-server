import mongoose, { Document } from 'mongoose';
import { IChatModel } from './Chat';

export interface IRide {
  departFrom: string;
  departDate: string;
  departTime: string;
  arriveAt: string;
  seatCapacity: number;
  isFullyBooked?: boolean;
  distance?: string;
  driver: mongoose.Schema.Types.ObjectId;
  passengers: mongoose.Schema.Types.ObjectId[];
  chats: mongoose.Schema.Types.ObjectId[];
}

export interface IRideModel extends IRide, Document {}
