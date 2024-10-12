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
exports.PostCategoryServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const postCategory_model_1 = require("./postCategory.model");
const postCategory_constant_1 = require("./postCategory.constant");
const createPostCategory = (postCategory) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postCategory_model_1.PostCategory.create(postCategory);
    return result;
});
const getAllPostCategories = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = new QueryBuilder_1.QueryBuilder(postCategory_model_1.PostCategory.find({ isDeleted: false }), query)
        .search(postCategory_constant_1.postCategorySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield posts.modelQuery;
    return result;
});
const getPostCategoryById = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield postCategory_model_1.PostCategory.findOne({
        _id: categoryId,
        isDeleted: false,
    });
    if (!isCategoryExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post Category not found!');
    }
    const category = yield postCategory_model_1.PostCategory.findOne({
        _id: categoryId,
        isDeleted: false,
    }).exec();
    return category;
});
const updatePostCategory = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield postCategory_model_1.PostCategory.findOne({
        _id: id,
        isDeleted: false,
    });
    if (!isCategoryExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post Category not found!');
    }
    const category = yield postCategory_model_1.PostCategory.findByIdAndUpdate(id, updateData, {
        new: true,
    });
    return category;
});
const deletePostCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield postCategory_model_1.PostCategory.findOne({
        _id: id,
        isDeleted: false,
    });
    if (!isCategoryExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post Category not found!');
    }
    const category = yield postCategory_model_1.PostCategory.findByIdAndDelete(id);
    return category;
});
exports.PostCategoryServices = {
    createPostCategory,
    getAllPostCategories,
    getPostCategoryById,
    updatePostCategory,
    deletePostCategory,
};
