import { model, Schema } from "mongoose";
import { TComment, TComments, TLikes, TPost, TPremium } from "./post.interface";
import { PostCategory } from "../postCategory/postCategory.model";

export const commentSchema = new Schema<TComment>({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: []
  },
});

const commentsSchema = new Schema<TComments>({
  count: {
    type: Number,
    default: 0,
  }, 
  comment: {
    type: [commentSchema], 
    required: false, 
    default: [],
  }
});

export const PremiumSchema = new Schema<TPremium>({
  isPending: {
    type: Boolean,
    required: false,
    default: true, 
  },
  subscriptionFee: {
    type: Number,
    required: false,
    default: 0,
  },
  subscribedUser: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: false,
    default: [], 
  }
});

const LikesSchema = new Schema<TLikes>({
  count: {
    type: Number,
    required: true,
    default: 0, 
  },
  user: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: false,
    default: [], 
  },
});


const postSchema = new Schema<TPost>(
  {
    title: { type: String, required: true },
    description: { type: String, require: true },
    images: {
      type: [String],
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "PostCategory",
      required: true,
    },
    likes: {
      type: LikesSchema,
      required: false, 
    },
    comments: {
      type: commentsSchema,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumDetails: PremiumSchema,
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

postSchema.post('save', async function (doc) {
  try {
    await PostCategory.findByIdAndUpdate(doc.category, {
      $inc: { postCount: 1 },
    });
  } catch (error) {
    throw new Error(
      `Failed to increment post count for category ${doc.category}: ${error}`
    );
  }
});

export const Post = model<TPost>('Post', postSchema);