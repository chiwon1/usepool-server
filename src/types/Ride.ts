import mongoose, { Document } from 'mongoose';

export interface IRide {
  departureLocation: string;
  departureAddress: string;
  departureCoordinate: number[];
  departureDate: string;
  departureTime: string;
  destination: string;
  destinationAddress: string;
  destinationCoordinate: number[];
  driver: mongoose.Schema.Types.ObjectId;
  passengers: mongoose.Schema.Types.ObjectId[];
  chatRooms: mongoose.Schema.Types.ObjectId[];
}

export interface IRideModel extends IRide, Document {}
