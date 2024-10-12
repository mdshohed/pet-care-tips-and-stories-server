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
exports.seed = void 0;
/* eslint-disable no-console */
const config_1 = __importDefault(require("../config"));
const postCategory_constant_1 = require("../modules/postCategory/postCategory.constant");
const postCategory_model_1 = require("../modules/postCategory/postCategory.model");
const user_constant_1 = require("../modules/User/user.constant");
const user_model_1 = require("../modules/User/user.model");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //at first check if the admin exist of not
        const admin = yield user_model_1.User.findOne({
            role: user_constant_1.USER_ROLE.ADMIN,
            email: config_1.default.admin_email,
            status: user_constant_1.USER_STATUS.ACTIVE,
        });
        if (!admin) {
            console.log('Seeding started...');
            yield user_model_1.User.create({
                name: 'Shohedul Islam',
                role: user_constant_1.USER_ROLE.ADMIN,
                email: config_1.default.admin_email,
                password: config_1.default.admin_password,
                mobileNumber: config_1.default.admin_mobile_number,
                profilePhoto: config_1.default.admin_profile_photo,
                status: user_constant_1.USER_STATUS.ACTIVE,
            });
            console.log('Admin created successfully...');
            console.log('Seeding completed...');
        }
        const category1 = yield postCategory_model_1.PostCategory.findOne({
            name: postCategory_constant_1.POST_CATEGORY.tips,
        });
        if (!category1) {
            yield postCategory_model_1.PostCategory.create({
                name: postCategory_constant_1.POST_CATEGORY.tips,
                postCount: 0,
            });
            console.log('Post Category1 created successfully...');
        }
        const category2 = yield postCategory_model_1.PostCategory.findOne({
            name: postCategory_constant_1.POST_CATEGORY.stories,
        });
        if (!category2) {
            yield postCategory_model_1.PostCategory.create({
                name: postCategory_constant_1.POST_CATEGORY.stories,
                postCount: 0,
            });
            console.log('Post Category2 created successfully...');
        }
    }
    catch (error) {
        console.log('Error in seeding', error);
    }
});
exports.seed = seed;
