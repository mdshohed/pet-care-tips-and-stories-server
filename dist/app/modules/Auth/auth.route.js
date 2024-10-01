"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../User/user.constant");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequest_copy_1 = require("../../middlewares/validateRequest copy");
const router = express_1.default.Router();
router.post('/register', 
// validateRequest(AuthValidation.registerValidationSchema),
auth_controller_1.AuthControllers.registerUser);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
router.post('/change-password', (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordValidationSchema), auth_controller_1.AuthControllers.changePassword);
router.post('/refresh-token', (0, validateRequest_copy_1.validateRequestCookies)(auth_validation_1.AuthValidation.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
exports.AuthRoutes = router;
