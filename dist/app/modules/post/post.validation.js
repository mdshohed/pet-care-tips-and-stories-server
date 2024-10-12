"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const objectIdSchema = zod_1.z.string().refine((val) => {
    return mongoose_1.default.Types.ObjectId.isValid(val);
}, {
    message: "Invalid ObjectId",
});
const replyCommentSchema = zod_1.z.object({
    text: zod_1.z.string().min(1, "Text is required"),
    user: objectIdSchema,
});
const commentSchema = zod_1.z.object({
    text: zod_1.z.string().min(1, "Text is required"),
    user: objectIdSchema,
    reply: replyCommentSchema.optional(),
});
const createPostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        image: zod_1.z.string().optional(),
        user: zod_1.z
            .string({
            required_error: 'User is required',
        })
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        }),
        category: zod_1.z
            .string({
            required_error: 'Category is required',
        })
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        }),
        likes: zod_1.z.object({
            count: zod_1.z.number(),
            user: zod_1.z
                .string({
                required_error: 'Category is required',
            })
                .refine((val) => {
                return mongoose_1.default.Types.ObjectId.isValid(val);
            }),
        }).optional(),
        comments: zod_1.z.object({
            count: zod_1.z.number(),
            comment: zod_1.z.array(commentSchema)
        }).optional(),
        status: zod_1.z.boolean().optional(),
        isPremium: zod_1.z.boolean().optional(),
        PremiumDetails: zod_1.z.object({
            subscriptionFee: zod_1.z.number().min(0, "Subscription fee must be a non-negative number"),
            isPending: zod_1.z.boolean(),
        }).optional(),
    }),
});
const updatePostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }).optional(),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }).optional(),
        image: zod_1.z.string().optional(),
        user: zod_1.z
            .string({
            required_error: 'User is required',
        })
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        }).optional(),
        category: zod_1.z
            .string({
            required_error: 'Category is required',
        })
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        }).optional(),
        likes: zod_1.z.object({
            count: zod_1.z.number(),
            user: zod_1.z
                .string({
                required_error: 'Category is required',
            })
                .refine((val) => {
                return mongoose_1.default.Types.ObjectId.isValid(val);
            }),
        }).optional(),
        comments: zod_1.z.object({
            count: zod_1.z.number(),
            comment: zod_1.z.array(commentSchema)
        }).optional(),
        status: zod_1.z.boolean().optional(),
        isPremium: zod_1.z.boolean().optional(),
        PremiumDetails: zod_1.z.object({
            subscriptionFee: zod_1.z.number().min(0, "Subscription fee must be a non-negative number"),
            isPending: zod_1.z.boolean(),
        }).optional(),
    }),
});
exports.PostValidation = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
