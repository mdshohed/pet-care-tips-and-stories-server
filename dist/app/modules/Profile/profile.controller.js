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
exports.ProfileController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const profile_service_1 = require("./profile.service");
// const getMyProfile = catchAsync(async (req: Request, res: Response) => {
//   const user = req.user;
//   const result = await ProfileServices.getMyProfile(user);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'My Profile Retrieved Successfully',
//     data: result,
//   });
// });
const getMyProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield profile_service_1.ProfileServices.getMyProfile(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'My Profile Retrieved Successfully',
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield profile_service_1.ProfileServices.updateMyProfile(req.user, req.body, req.file);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Profile updated successfully',
        data: result,
    });
}));
exports.ProfileController = {
    getMyProfile,
    updateMyProfile,
};
