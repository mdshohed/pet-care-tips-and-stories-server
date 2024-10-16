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
exports.PaymentServices = void 0;
const mongoose_1 = require("mongoose");
const post_model_1 = require("../post/post.model");
const user_model_1 = require("../User/user.model");
const payment_model_1 = require("./payment.model");
const createPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = new mongoose_1.Types.ObjectId(payload.userId);
    const post = yield post_model_1.Post.findById(payload.postId);
    console.log("post", payload.postId, post);
    if (!post) {
        throw new Error(`Post with ID ${payload.postId} not found.`);
    }
    const user = yield user_model_1.User.findById(payload.userId);
    if (!user) {
        throw new Error(`User with ID ${payload.userId} not found.`);
    }
    if (!post.premiumDetails) {
        throw new Error(`Post Premium Details Not Found!`);
    }
    const updatePost = post.premiumDetails.subscribedUser;
    console.log("updatePost1", updatePost);
    let updateData;
    if (updatePost && !updatePost.some((id) => id.equals(userId))) {
        updateData = {
            'premiumDetails.subscriptionFee': (_a = post.premiumDetails) === null || _a === void 0 ? void 0 : _a.subscriptionFee,
            'premiumDetails.isPending': (_b = post.premiumDetails) === null || _b === void 0 ? void 0 : _b.isPending,
            'premiumDetails.subscribedUser': [...updatePost, payload.userId],
        };
    }
    else {
        updateData = updatePost;
    }
    console.log("updatePost2", updateData);
    const postUpdated = yield post_model_1.Post.findByIdAndUpdate(payload.postId, { $set: updateData }, // Use $set to update nested fields properly
    { new: true } // Return the updated document
    );
    console.log("update", postUpdated);
    if (postUpdated) {
        const findPayment = yield payment_model_1.Payment.findOne({ userId: payload.userId, postId: payload.postId });
        if (!findPayment) {
            yield payment_model_1.Payment.create(payload);
        }
    }
    return postUpdated;
});
const getAllPaymentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.Payment.find().populate("userId").populate("postId");
    console.log("result", result);
    return result;
});
exports.PaymentServices = {
    createPayment,
    getAllPaymentsFromDB,
};
