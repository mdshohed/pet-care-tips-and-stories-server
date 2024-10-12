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
exports.PostServices = void 0;
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const meilisearch_1 = require("../../utils/meilisearch");
const post_constant_1 = require("./post.constant");
const post_model_1 = require("./post.model");
const post_utils_1 = require("./post.utils");
const createPostIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemImages } = images;
    payload.images = itemImages.map((image) => image.path);
    payload.likes = { count: 0, user: [] };
    payload.comments = { count: 0, comment: [] };
    const result = yield post_model_1.Post.create(payload);
    yield (0, meilisearch_1.addDocumentToIndex)(result, 'posts');
    return result;
});
const getAllPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = (yield (0, post_utils_1.SearchPostByUserQueryMaker)(query)) || query;
    // Date range search
    query = (yield (0, post_utils_1.SearchPostByDateRangeQueryMaker)(query)) || query;
    query = (yield (0, post_utils_1.SearchPostByCategoryQueryMaker)(query)) || query;
    const postQuery = new QueryBuilder_1.QueryBuilder(post_model_1.Post.find().populate('user').populate('category'), query)
        .filter()
        .search(post_constant_1.PostSearchableFields)
        .sort()
        // .paginate()
        .fields();
    const result = yield postQuery.modelQuery;
    return result;
});
const getPremiumPostsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.find({ isPremium: true })
        .populate('user')
        .populate('category');
    return result;
});
const getPostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findById(postId)
        .populate('user')
        .populate('category');
    return result;
});
const updatePostInDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, payload, { new: true });
    if (result) {
        yield (0, meilisearch_1.addDocumentToIndex)(result, 'posts');
    }
    else {
        throw new Error(`Post with ID ${postId} not found.`);
    }
    return result;
});
const mongoose_1 = require("mongoose");
const updatePostLikesInDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = new mongoose_1.Types.ObjectId(payload.userId);
    const findPost = yield post_model_1.Post.findById(postId);
    if (!findPost) {
        throw new Error(`Post with ID ${postId} not found.`);
    }
    const findPostUser = ((_a = findPost.likes) === null || _a === void 0 ? void 0 : _a.user) || [];
    const hasUserLiked = findPostUser.some((id) => id.equals(userId));
    let updateData;
    if (!hasUserLiked) {
        updateData = {
            'likes.count': findPost.likes.count + 1,
            'likes.user': [...findPostUser, userId],
        };
    }
    else {
        updateData = {
            'likes.count': findPost.likes.count - 1,
            'likes.user': findPostUser.filter((id) => !id.equals(userId)),
        };
    }
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, updateData, { new: true });
    if (result) {
        yield (0, meilisearch_1.addDocumentToIndex)(result, 'posts');
    }
    else {
        throw new Error(`Post with ID ${postId} not found.`);
    }
    return result;
});
const deletePostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndDelete(postId);
    const deletedPostId = result === null || result === void 0 ? void 0 : result._id;
    if (deletedPostId) {
        yield (0, meilisearch_1.deleteDocumentFromIndex)('posts', deletedPostId.toString());
    }
    return result;
});
exports.PostServices = {
    createPostIntoDB,
    getAllPostsFromDB,
    getPostFromDB,
    updatePostInDB,
    deletePostFromDB,
    updatePostLikesInDB,
    getPremiumPostsFromDB,
};
