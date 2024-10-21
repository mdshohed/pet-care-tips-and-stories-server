"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const validateImageFileRequest_1 = __importDefault(require("../../middlewares/validateImageFileRequest"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const image_validation_1 = require("../../zod/image.validation");
const post_controller_1 = require("./post.controller");
const post_validation_1 = require("./post.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), multer_config_1.multerUpload.fields([{ name: 'itemImages' }]), (0, validateImageFileRequest_1.default)(image_validation_1.ImageFilesArrayZodSchema), bodyParser_1.parseBody, (0, validateRequest_1.default)(post_validation_1.PostValidation.createPostValidationSchema), post_controller_1.PostControllers.createPost);
router.get('/scroll', post_controller_1.PostControllers.getAllPostsWithScroll);
router.get('/admin', post_controller_1.PostControllers.getAllPostsForAdmin);
router.get('/', post_controller_1.PostControllers.getAllPosts);
// router.get('/', PostControllers.getAllPostsWithScroll);
router.get('/search-post', post_controller_1.PostControllers.getSearchPostFromDB);
router.get('/premium', post_controller_1.PostControllers.getPremiumPosts);
router.get('/:id', post_controller_1.PostControllers.getPost);
router.get('/me/:id', post_controller_1.PostControllers.getMyPost);
router.put('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(post_validation_1.PostValidation.updatePostValidationSchema), post_controller_1.PostControllers.updatePost);
router.put('/likes/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), post_controller_1.PostControllers.updatePostLikes);
router.put('/premium/:id', post_controller_1.PostControllers.updatePremiumPost);
router.put('/delete/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), post_controller_1.PostControllers.deletePost);
// comments operation
router.post('/comments/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), post_controller_1.PostControllers.addCommentInPost);
router.get('/comments/:id', post_controller_1.PostControllers.getComments);
router.put('/comments/:id', post_controller_1.PostControllers.updateComments);
router.put('/comments/delete/:id', post_controller_1.PostControllers.deleteComments);
exports.PostRoutes = router;
