"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const postCategory_controller_1 = require("./postCategory.controller");
const postCategory_validation_1 = require("./postCategory.validation");
const router = express_1.default.Router();
router.get('/', postCategory_controller_1.PostCategoryControllers.getAllPostCategories);
router.get('/:id', postCategory_controller_1.PostCategoryControllers.getPostCategoryById);
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(postCategory_validation_1.PostCategoryValidation.createPostCategoryValidationSchema), postCategory_controller_1.PostCategoryControllers.createPostCategory);
router.put('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(postCategory_validation_1.PostCategoryValidation.updatePostCategoryValidationSchema), postCategory_controller_1.PostCategoryControllers.updatePostCategory);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), postCategory_controller_1.PostCategoryControllers.deletePostCategory);
exports.PostCategoryRoutes = router;
