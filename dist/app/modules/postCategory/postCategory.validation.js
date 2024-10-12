"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCategoryValidation = void 0;
const zod_1 = require("zod");
const createPostCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
    }),
});
const updatePostCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
    }),
});
exports.PostCategoryValidation = {
    createPostCategoryValidationSchema,
    updatePostCategoryValidationSchema,
};
