import { model, Schema } from "mongoose";
import { TRental } from "./rental.interface";

const RentalSchema = new Schema<TRental>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bikeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Bike",
    },
    startTime: {
      type: Date,
      required: true,
    },
    returnTime: {
      type: Date,
      // required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    isReturned: {
      type: Boolean,
      required: true,
    },
  },
);



export const Rental = model<TRental>("Rental", RentalSchema);
