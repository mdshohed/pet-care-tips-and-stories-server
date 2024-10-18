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
const post_constant_1 = require("./post.constant");
const post_model_1 = require("./post.model");
const post_utils_1 = require("./post.utils");
const createPostIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemImages } = images;
    payload.images = itemImages.map((image) => image.path);
    payload.likes = { count: 0, user: [], upVote: [], downVote: [] };
    payload.comments = { count: 0, comment: [] };
    const result = yield post_model_1.Post.create(payload);
    return result;
});
const getAllPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = (yield (0, post_utils_1.SearchPostByUserQueryMaker)(query)) || query;
    // Date range search
    query = (yield (0, post_utils_1.SearchPostByDateRangeQueryMaker)(query)) || query;
    query = (yield (0, post_utils_1.SearchPostByCategoryQueryMaker)(query)) || query;
    const itemQuery = new QueryBuilder_1.QueryBuilder(post_model_1.Post.find().populate('user').populate('category').populate('comments.comment.user'), query)
        .filter()
        .search(post_constant_1.PostSearchableFields)
        .sort()
        // .paginate()
        .fields();
    const result = yield itemQuery.modelQuery;
    // const result = await Post.find({
    //   $or: [
    //     { isPremium: false },
    //     { isPremium: true, 'premiumDetails.isPending': false }
    //   ]
    // })
    //   .populate('user')
    //   .populate('category');
    // console.log("value", query);
    const newResult = result.filter((post) => { var _a; return (post === null || post === void 0 ? void 0 : post.isPremium) === false || ((_a = post.premiumDetails) === null || _a === void 0 ? void 0 : _a.isPending) === false; });
    return newResult;
});
const getAllPostsForAdminFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.find().populate('user').populate('category').populate('comments.comment.user');
    return result;
});
const getSearchPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = (yield (0, post_utils_1.SearchPostByUserQueryMaker)(query)) || query;
    // Date range search
    query = (yield (0, post_utils_1.SearchPostByDateRangeQueryMaker)(query)) || query;
    query = (yield (0, post_utils_1.SearchPostByCategoryQueryMaker)(query)) || query;
    const itemQuery = new QueryBuilder_1.QueryBuilder(post_model_1.Post.find().populate('user').populate('category').populate('comments.comment.user'), query)
        .filter()
        .search(post_constant_1.PostSearchableFields)
        .sort()
        // .paginate()
        .fields();
    const result = yield itemQuery.modelQuery;
    // const result = await Post.find({
    //   $or: [
    //     { isPremium: false },
    //     { isPremium: true, 'premiumDetails.isPending': false }
    //   ]
    // })
    //   .populate('user')
    //   .populate('category');
    const newResult = result.filter((post) => { var _a; return ((_a = post.premiumDetails) === null || _a === void 0 ? void 0 : _a.isPending) !== false; });
    return newResult;
});
const getPremiumPostsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.find({ isPremium: true })
        .populate('user').populate('category').populate('comments.comment.user');
    return result;
});
const getPostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findById(id).populate('user').populate('category').populate('comments.comment.user');
    return result;
});
const getMyPostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.find({ user: id }).populate('user').populate('category').populate('comments.comment.user');
    return result;
});
const updatePostInDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, payload, { new: true });
    // if (result) {
    //   await addDocumentToIndex(result, 'posts');
    // } else {
    //   throw new Error(`Post with ID ${postId} not found.`);
    // }
    if (!result) {
        throw new Error(`Post with ID ${postId} not found.`);
    }
    return result;
});
const updatePremiumPost = (params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const post = yield post_model_1.Post.findById(params);
    if (!post) {
        throw new Error(`Post with Id ${params} not found!`);
    }
    let updatePost = post === null || post === void 0 ? void 0 : post.premiumDetails;
    if (post.premiumDetails) {
        updatePost = {
            isPending: !((_a = post.premiumDetails) === null || _a === void 0 ? void 0 : _a.isPending),
            subscriptionFee: post.premiumDetails.subscriptionFee,
            subscribedUser: (_b = post.premiumDetails) === null || _b === void 0 ? void 0 : _b.subscribedUser
        };
    }
    const result = yield post_model_1.Post.findByIdAndUpdate(params, { premiumDetails: updatePost }, { new: true });
    if (!result) {
        throw new Error(`Post update Error.`);
    }
    return result;
});
const mongoose_1 = require("mongoose");
const user_model_1 = require("../User/user.model");
const updatePostLikesInDBX = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    return result;
});
const updatePostLikesInDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = new mongoose_1.Types.ObjectId(payload.userId);
    const findPost = yield post_model_1.Post.findById(postId);
    if (!findPost) {
        throw new Error(`Post with ID ${postId} not found.`);
    }
    const findUser = yield user_model_1.User.findById(payload.userId);
    if (!findUser) {
        throw new Error(`User with ID ${postId} not found.`);
    }
    const upVote = ((_a = findPost.likes) === null || _a === void 0 ? void 0 : _a.upVote) || [];
    const downVote = ((_b = findPost.likes) === null || _b === void 0 ? void 0 : _b.downVote) || [];
    const hasUserUpVote = upVote.some((id) => id.equals(userId));
    const hasUserDownVote = downVote.some((id) => id.equals(userId));
    let updateData;
    if (hasUserDownVote || hasUserUpVote) {
        if (hasUserUpVote) {
            const newUpVote = upVote.filter((id) => id.toString() !== userId.toString());
            if (payload.type === "Up") {
                updateData = {
                    'likes.count': findPost.likes.count - 1,
                    'likes.upVote': [...newUpVote],
                    'likes.downVote': [...downVote],
                };
            }
            else {
                updateData = {
                    'likes.count': findPost.likes.count - 2,
                    'likes.upVote': [...newUpVote],
                    'likes.downVote': [...downVote, userId],
                };
            }
        }
        else {
            const newDownVote = downVote.filter((id) => id.toString() !== userId.toString());
            // console.log("payload", payload.type, newDownVote, u);
            if (payload.type === "Down") {
                updateData = {
                    'likes.count': findPost.likes.count + 1,
                    'likes.upVote': [...upVote],
                    'likes.downVote': [...newDownVote],
                };
            }
            else {
                updateData = {
                    'likes.count': findPost.likes.count + 2,
                    'likes.upVote': [...upVote, userId],
                    'likes.downVote': [...newDownVote],
                };
            }
        }
    }
    else {
        if (payload.type === "Up") {
            updateData = {
                'likes.count': findPost.likes.count + 1,
                'likes.upVote': [...upVote, userId],
                'likes.downVote': [...downVote],
            };
        }
        else {
            updateData = {
                'likes.count': findPost.likes.count - 1,
                'likes.upVote': [...upVote],
                'likes.downVote': [...downVote, userId],
            };
        }
    }
    console.log("value", updateData);
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, updateData, { new: true });
    return result;
});
const deletePostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndDelete(postId);
    // const deletedPostId = result?._id;
    // if (deletedPostId) {
    //   await deleteDocumentFromIndex('posts', deletedPostId.toString());
    // }
    return result;
});
// comments services operation 
const getComments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Post.find( {user: id}).populate('user').populate('category').populate('comments.comment.user');
    // return result;
});
const addCommentsInToDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongoose_1.Types.ObjectId(payload.userId);
        // Aggregate pipeline for the update
        const result = yield post_model_1.Post.updateOne({ _id: new mongoose_1.Types.ObjectId(postId) }, // Match the post by postId
        [
            {
                $set: {
                    'comments.comment': {
                        $concatArrays: [
                            {
                                $ifNull: ['$comments.comment', []],
                            },
                            [{ text: payload.text, user: userId }],
                        ],
                    },
                    // Increment the comment count
                    'comments.count': { $add: [{ $ifNull: ['$comments.count', 0] }, 1] },
                },
            },
        ]);
        if (result.matchedCount === 0) {
            throw new Error(`Post with ID ${postId} not found.`);
        }
        return result;
    }
    catch (error) {
        console.error('Error updating comments:', error);
        throw error;
    }
});
const updateComments = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postObjectId = new mongoose_1.Types.ObjectId(postId);
        const result = yield post_model_1.Post.updateOne({ _id: postObjectId }, {
            $set: {
                [`comments.comment.${payload.index}.text`]: payload.text, // Use array indexing to update the comment's text
            },
        });
        if (result.matchedCount === 0) {
            throw new Error(`Post with ID ${postId} not found.`);
        }
        if (result.modifiedCount === 0) {
            throw new Error(`Comment at index ${payload.index} could not be updated.`);
        }
        return result;
    }
    catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
});
const deleteComments = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield post_model_1.Post.updateOne({ _id: new mongoose_1.Types.ObjectId(postId) }, [
            {
                $set: {
                    // Use $concatArrays to reconstruct the array without the comment at the specified index
                    'comments.comment': {
                        $concatArrays: [
                            { $slice: ['$comments.comment', payload.index] }, // Get elements before the index
                            { $slice: ['$comments.comment', { $add: [payload.index, 1] }, { $size: '$comments.comment' }] } // Get elements after the index
                        ],
                    },
                    // Decrement the comment count
                    'comments.count': { $subtract: [{ $ifNull: ['$comments.count', 0] }, 1] },
                },
            },
        ]);
        console.log("result", result);
        if (result.matchedCount === 0) {
            throw new Error(`Post with ID ${postId} not found.`);
        }
        return result;
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
});
exports.PostServices = {
    createPostIntoDB,
    getAllPostsFromDB,
    getAllPostsForAdminFromDB,
    getPostFromDB,
    getMyPostFromDB,
    updatePostInDB,
    deletePostFromDB,
    updatePostLikesInDB,
    getPremiumPostsFromDB,
    updatePremiumPost,
    getSearchPosts,
    addCommentsInToDB,
    getComments,
    updateComments,
    deleteComments,
};
