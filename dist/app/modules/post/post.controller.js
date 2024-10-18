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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_service_1 = require("./post.service");
const createPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        throw new AppError_1.default(400, 'Please upload an image');
    }
    const post = yield post_service_1.PostServices.createPostIntoDB(req.body, req.files);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post created successfully',
        data: post,
    });
}));
const getAllPostsForAdmin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_service_1.PostServices.getAllPostsForAdminFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post retrieved successfully',
        data: post,
    });
}));
const getAllPosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_service_1.PostServices.getAllPostsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post retrieved successfully',
        data: post,
    });
}));
const getSearchPostFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, limit } = req.query;
    const numberLimit = Number(limit) || 10;
    const result = yield post_service_1.PostServices.getSearchPosts(
    // numberLimit
    // searchTerm as string
    req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Items Retrieved Successfully',
        data: result,
    });
}));
const getPremiumPosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_service_1.PostServices.getPremiumPostsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post retrieved successfully',
        data: post,
    });
}));
const getPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const post = yield post_service_1.PostServices.getPostFromDB(postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post retrieved successfully',
        data: post,
    });
}));
const getMyPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const post = yield post_service_1.PostServices.getMyPostFromDB(postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post retrieved successfully',
        data: post,
    });
}));
const updatePost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedPost = yield post_service_1.PostServices.updatePostInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post updated successfully',
        data: updatedPost,
    });
}));
const updatePostLikes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedPost = yield post_service_1.PostServices.updatePostLikesInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post updated successfully',
        data: updatedPost,
    });
}));
const updatePremiumPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedPost = yield post_service_1.PostServices.updatePremiumPost(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Premium Post updated successfully',
        data: updatedPost,
    });
}));
const deletePost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield post_service_1.PostServices.deletePostFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Post deleted successfully',
        data: null,
    });
}));
// comments operation
const addCommentInPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield post_service_1.PostServices.addCommentsInToDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Comment Added successfully',
        data: result,
    });
}));
const getComments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield post_service_1.PostServices.getComments(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Comments retrieved successfully',
        data: post,
    });
}));
const updateComments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedPost = yield post_service_1.PostServices.updateComments(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'comments updated successfully',
        data: updatedPost,
    });
}));
const deleteComments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log("req", req.body, id);
    yield post_service_1.PostServices.deleteComments(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'comments deleted successfully',
        data: null,
    });
}));
exports.PostControllers = {
    createPost,
    getAllPosts,
    getAllPostsForAdmin,
    getSearchPostFromDB,
    getPost,
    getMyPost,
    updatePost,
    deletePost,
    updatePostLikes,
    getPremiumPosts,
    updatePremiumPost,
    addCommentInPost,
    getComments,
    updateComments,
    deleteComments,
};
