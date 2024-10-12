import { Schema, model } from 'mongoose';
import { PostCategoryDocument, PostCategoryModel } from './postCategory.interface';
import { POST_CATEGORY } from './postCategory.constant';

const PostCategorySchema = new Schema<PostCategoryDocument>(
  {
    name: {
      type: String,
      enum: POST_CATEGORY, 
      default: POST_CATEGORY.tips
    },
    postCount: {
      type: Number,
      default: 0,
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

export const PostCategory = model<PostCategoryDocument, PostCategoryModel>(
  'PostCategory',
  PostCategorySchema
);
