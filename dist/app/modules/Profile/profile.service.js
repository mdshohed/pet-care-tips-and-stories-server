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
exports.ProfileServices = void 0;
const user_model_1 = require("../User/user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_constant_1 = require("../User/user.constant");
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield user_model_1.User.findOne({
        email: user.email,
        status: user_constant_1.USER_STATUS.ACTIVE
    });
    if (!profile) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exixts!");
    }
    ;
    return profile;
});
const updateMyProfile = (user, data, profilePhoto) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        email: user.email,
        status: user_constant_1.USER_STATUS.ACTIVE
    };
    const profile = yield user_model_1.User.findOne(filter);
    if (!profile) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User profile does not exixts!");
    }
    ;
    if (profilePhoto) {
        data.profilePhoto = profilePhoto.path;
    }
    else {
        delete data.profilePhoto;
    }
    ;
    return yield user_model_1.User.findOneAndUpdate(filter, data, { new: true });
});
exports.ProfileServices = {
    getMyProfile,
    updateMyProfile
};
