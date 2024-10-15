import { model, Schema } from "mongoose";
import { IPaymentUsers, TPayment } from "./payment.interface";


const PaymentSchema = new Schema<TPayment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post", 
      required: true,
    },
    transactionId: {
      type: String,
      required: true, 
    },
    paidAmount: {
      type: Number,
      required: true, 
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<TPayment>('Payment', PaymentSchema);
