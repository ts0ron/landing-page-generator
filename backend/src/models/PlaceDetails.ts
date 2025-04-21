import mongoose, { Schema, Document } from "mongoose";
import { BaseEntity } from "./BaseEntity";

export interface IPlaceDetailsFields {
  name: string;
  address: string;
  phoneNumber?: string;
  internationalPhoneNumber?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  types: string[];
  photos: {
    photoReference: string;
    width: number;
    height: number;
    htmlAttributions: string[];
  }[];
  openingHours?: {
    openNow: boolean;
    periods?: {
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }[];
    weekdayText?: string[];
  };
  priceLevel?: number;
  reviews?: {
    authorName: string;
    rating: number;
    text: string;
    time: number;
  }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  businessStatus?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlaceDetails extends BaseEntity, IPlaceDetailsFields {}

export interface IPlaceDetailsDocument extends IPlaceDetailsFields, Document {
  _id: string;
}

const PlaceDetailsSchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String },
  internationalPhoneNumber: { type: String },
  website: { type: String },
  rating: { type: Number },
  userRatingsTotal: { type: Number },
  types: { type: [String], required: true },
  photos: [
    {
      photoReference: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      htmlAttributions: { type: [String], required: true },
    },
  ],
  openingHours: {
    openNow: { type: Boolean },
    periods: [
      {
        open: {
          day: { type: Number },
          time: { type: String },
        },
        close: {
          day: { type: Number },
          time: { type: String },
        },
      },
    ],
    weekdayText: { type: [String] },
  },
  priceLevel: { type: Number },
  reviews: [
    {
      authorName: { type: String },
      rating: { type: Number },
      text: { type: String },
      time: { type: Number },
    },
  ],
  geometry: {
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    viewport: {
      northeast: {
        lat: { type: Number },
        lng: { type: Number },
      },
      southwest: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
  },
  businessStatus: { type: String },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPlaceDetailsDocument>(
  "PlaceDetails",
  PlaceDetailsSchema
);
