import { ObjectId } from "mongoose";

export type TReplyComment = {
  text: string, 
  user: ObjectId; 
}

export type TComment = {
  text: string, 
  user: ObjectId; 
  reply?: TReplyComment; 
}

export type TComments = {
  count: number, 
  comment: TComment[]
}

export type TPremium = {
  subscriptionFee: number;
  isPending: boolean; 
}

export type TLikes = {
  count: number,
  user: ObjectId[]
}

export type TPost = {
  title?: string;
  description: string;
  images?: string[];
  date?: Date;
  user: ObjectId;
  category: ObjectId;
  likes?: TLikes;
  comments?: TComments
  status?: boolean;
  isPremium?: boolean,
  premiumDetails?: TPremium, 
  createdAt?: Date;
  updatedAt?: Date;
};