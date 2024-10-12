import mongoose from 'mongoose';
import { z } from 'zod';


const objectIdSchema = z.string().refine((val) => {
  return mongoose.Types.ObjectId.isValid(val);
}, {
  message: "Invalid ObjectId",
});

const replyCommentSchema = z.object({
  text: z.string().min(1, "Text is required"),
  user: objectIdSchema,
});

const commentSchema = z.object({
  text: z.string().min(1, "Text is required"),
  user: objectIdSchema,
  reply: replyCommentSchema.optional(),
});


const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    image: z.string().optional(),
    user: z
      .string({
        required_error: 'User is required',
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }),
    category: z
      .string({
        required_error: 'Category is required',
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }),
    likes: z.object({
      count: z.number(),
      user: z
      .string({
        required_error: 'Category is required',
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }),
    }).optional(), 
    comments: z.object({
      count: z.number(),
      comment: z.array(commentSchema)
    }).optional(),  
    status: z.boolean().optional(),
    isPremium: z.boolean().optional(),
    PremiumDetails: z.object({
      subscriptionFee: z.number().min(0, "Subscription fee must be a non-negative number"),
      isPending: z.boolean(),
    }).optional(), 
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).optional(),
    description: z.string({
      required_error: 'Description is required',
    }).optional(),
    image: z.string().optional(),
    user: z
      .string({
        required_error: 'User is required',
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }).optional(),
    category: z
      .string({
        required_error: 'Category is required',
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }).optional(),
    likes: z.object({
      count: z.number(),
      user: z
      .string({
        required_error: 'Category is required',
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }),
    }).optional(), 
    comments: z.object({
      count: z.number(),
      comment: z.array(commentSchema)
    }).optional(),  
    status: z.boolean().optional(),
    isPremium: z.boolean().optional(),
    PremiumDetails: z.object({
      subscriptionFee: z.number().min(0, "Subscription fee must be a non-negative number"),
      isPending: z.boolean(),
    }).optional(), 
  }),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
