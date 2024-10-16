
import { Types } from "mongoose";
import { Post } from "../post/post.model";
import { User } from "../User/user.model";
import { TPayment } from "./payment.constant";
import { Payment } from "./payment.model";


const createPayment = async (payload: TPayment) => {
  const userId = new Types.ObjectId(payload.userId);  
  const post = await Post.findById(payload.postId)
  console.log("post", payload.postId, post);
  
  if(!post){
    throw new Error(`Post with ID ${payload.postId} not found.`);
  }
  const user = await User.findById(payload.userId)
  if(!user){
    throw new Error(`User with ID ${payload.userId} not found.`);
  }
  if(!post.premiumDetails){
    throw new Error(`Post Premium Details Not Found!`);
  }
  const updatePost = post.premiumDetails.subscribedUser;
  console.log("updatePost1", updatePost);
  
  let updateData;
  if (updatePost && !updatePost.some((id: any) => id.equals(userId))) {
    updateData = {
      'premiumDetails.subscriptionFee': post.premiumDetails?.subscriptionFee,
      'premiumDetails.isPending': post.premiumDetails?.isPending, 
      'premiumDetails.subscribedUser': [...updatePost, payload.userId],
    };
  } 
  else {
    updateData = updatePost
  }
  console.log("updatePost2", updateData);

  const postUpdated = await Post.findByIdAndUpdate(
    payload.postId, 
    { $set: updateData },   // Use $set to update nested fields properly
    { new: true }           // Return the updated document
  );
    console.log("update", postUpdated);
  
  if(postUpdated){
    const findPayment = await Payment.findOne({userId: payload.userId, postId: payload.postId})
    if(!findPayment){
      await Payment.create(payload);
    }
  }
  return postUpdated;
};

const getAllPaymentsFromDB = async () => {
  const result = await Payment.find().populate("userId").populate("postId");
  console.log("result", result);
  
  return result;
};

export const PaymentServices = {
  createPayment,
  getAllPaymentsFromDB,
};
