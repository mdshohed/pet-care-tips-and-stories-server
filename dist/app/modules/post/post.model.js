"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.PremiumSchema = exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
const postCategory_model_1 = require("../postCategory/postCategory.model");
exports.commentSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: []
    },
});
const commentsSchema = new mongoose_1.Schema({
    count: {
        type: Number,
        default: 0,
    },
    comment: {
        type: [exports.commentSchema],
        required: false,
        default: [],
    }
});
exports.PremiumSchema = new mongoose_1.Schema({
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
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User",
        required: false,
        default: [],
    }
});
const LikesSchema = new mongoose_1.Schema({
    count: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User",
        required: false,
        default: [],
    },
});
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, require: true },
    images: {
        type: [String],
        default: [],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    premiumDetails: exports.PremiumSchema,
}, {
    timestamps: true,
    virtuals: true,
});
postSchema.post('save', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield postCategory_model_1.PostCategory.findByIdAndUpdate(doc.category, {
                $inc: { postCount: 1 },
            });
        }
        catch (error) {
            throw new Error(`Failed to increment post count for category ${doc.category}: ${error}`);
        }
    });
});
exports.Post = (0, mongoose_1.model)('Post', postSchema);
