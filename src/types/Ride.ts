import mongoose, { Document } from 'mongoose';

export interface IRide {
  departureLocation: string;
  departureAddress: string;
  departureCoordinate: ICoordinate;
  departureDate: string;
  departureTime: string;
  destination: string;
  destinationAddress: string;
  destinationCoordinate: ICoordinate;
  driver: mongoose.Schema.Types.ObjectId;
  passengers: mongoose.Schema.Types.ObjectId[];
  chatRooms: mongoose.Schema.Types.ObjectId[];
}

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IRideModel extends IRide, Document {}
