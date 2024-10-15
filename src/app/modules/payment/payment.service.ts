
import { Types } from "mongoose";
import { Post } from "../post/post.model";
import { User } from "../User/user.model";
import { TPayment } from "./payment.constant";
import { Payment } from "./payment.model";


const createPayment = async (payload: TPayment) => {
  const userId = new Types.ObjectId(payload.userId);  
  const post = await Post.findById(payload.postId)
  if(!post){
    throw new Error(`Post with ID ${payload.postId} not found.`);
  }
  const user = await User.findById(payload.userId)
  if(!user){
    throw new Error(`User with ID ${payload.userId} not found.`);
  }
  const updatePost = post.premiumDetails?.subscribedUser || [];
  console.log("updatePost", updatePost);
  
  let updateData;
  if (!updatePost.some((id: any) => id.equals(userId))) {
    updateData = {
      'premiumDetails.subscriptionFee': post.premiumDetails?.subscriptionFee,
      'premiumDetails.isPending': post.premiumDetails?.isPending, 
      'premiumDetails.subscribedUser': [...updatePost, payload.userId],
    };
  } 
  const postUpdated = await Post.findByIdAndUpdate( payload.postId, { premiumDetails: updateData}, {new: true})
  if(postUpdated){
    const findPayment = Payment.findOne({userId: payload.userId, postId: payload.postId})
    if(!findPayment){
      await Payment.create(payload);
    }
  }
  return postUpdated;
};

const getAllPaymentsFromDB = async () => {
  const result = await Payment.find();
  return result;
};

export const PaymentServices = {
  createPayment,
  getAllPaymentsFromDB,
};
