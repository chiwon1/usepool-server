import mongoose, { Document } from 'mongoose';

export interface IRide {
  departLocation: string;
  departAddress: string;
  departCoordinate: number[];
  departDate: string;
  departTime: string;
  destination: string;
  destinationAddress: string;
  destinationCoordinate: number[];
  driver: mongoose.Schema.Types.ObjectId;
  passengers: mongoose.Schema.Types.ObjectId[];
  chatRooms: mongoose.Schema.Types.ObjectId[];
}

export interface IRideModel extends IRide, Document {}
