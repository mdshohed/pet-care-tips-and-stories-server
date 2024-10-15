import { ObjectId } from "mongoose";



export interface IPaymentUsers {
  paidAmount: number, 
  userId: ObjectId,
}

export interface TPayment {
  postId: ObjectId, 
  transactionId: string, 
  paidAmount: number, 
  userId: ObjectId,
  isDeleted?: boolean, 
}