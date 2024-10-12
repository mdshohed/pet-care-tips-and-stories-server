"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCategory = void 0;
const mongoose_1 = require("mongoose");
const postCategory_constant_1 = require("./postCategory.constant");
const PostCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        enum: postCategory_constant_1.POST_CATEGORY,
        default: postCategory_constant_1.POST_CATEGORY.tips
    },
    postCount: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.PostCategory = (0, mongoose_1.model)('PostCategory', PostCategorySchema);
