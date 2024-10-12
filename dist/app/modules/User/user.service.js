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
exports.UserServices = void 0;
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.create(payload);
    return user;
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const users = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query)
        .fields()
        .paginate()
        .sort()
        .filter()
        .search(user_constant_1.UserSearchableFields);
    const result = yield users.modelQuery;
    return result;
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id)
        .populate('follower')
        .populate('following');
    return user;
});
const updateFriendConnectionInToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const firstUserId = new mongoose_1.Types.ObjectId(id);
    const secondUserId = new mongoose_1.Types.ObjectId(payload.connectUser);
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new Error(`User ${id} not found.`);
    }
    const secondUser = yield user_model_1.User.findById(payload.connectUser);
    if (!secondUser) {
        throw new Error(`Second User ${payload.connectUser} not found.`);
    }
    const followingUser = user.following || [];
    // const hasUserLiked = user.following?.some((id: any) => id.equals(secondUserId));
    let followingData;
    if (!((_a = user.following) === null || _a === void 0 ? void 0 : _a.some((id) => id.equals(secondUserId)))) {
        followingData = [...followingUser, secondUserId];
    }
    else {
        console.log("value", followingUser, secondUser);
        followingData = followingUser.filter((id) => !id.equals(secondUserId));
    }
    console.log("updateFollowing", followingData);
    // follower part
    const followerUser = secondUser.follower || [];
    let followerData;
    if (!((_b = secondUser.follower) === null || _b === void 0 ? void 0 : _b.some((id) => id.equals(firstUserId)))) {
        followerData = [...followerUser, firstUserId];
    }
    else {
        console.log("value", followingUser, secondUser);
        followerData = followerUser.filter((id) => !id.equals(firstUserId));
    }
    const success = yield user_model_1.User.findByIdAndUpdate(id, { following: followingData }, { new: true });
    if (!success) {
        throw new Error(`Following updated Error!`);
    }
    const result = yield user_model_1.User.findByIdAndUpdate(payload.connectUser, { follower: followerData }, { new: true });
    return result;
});
exports.UserServices = {
    createUser,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateFriendConnectionInToDB,
};
