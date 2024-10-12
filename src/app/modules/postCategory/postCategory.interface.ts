import { Document, Model } from 'mongoose';

export interface PostCategoryDocument extends Document {
  name: string;
  postCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TPostCategory = {
  name: "Tips" | "Stories";
  postCount?: number;
  isDeleted?: boolean;
};

export type PostCategoryModel = Model<PostCategoryDocument>;
