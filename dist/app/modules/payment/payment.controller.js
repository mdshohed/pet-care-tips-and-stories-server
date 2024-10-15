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
exports.PaymentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const stripe = require("stripe")(config_1.default.stripe_secret_kay);
const createClientSecret = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price } = req.body;
    // console.log("value", price*1000);
    const amount = price * 100;
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: [
            'card'
        ],
    });
    console.log("data", paymentIntent.client_secret);
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}));
const createPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield payment_service_1.PaymentServices.createPayment(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Payment Created Successfully',
        data: user,
    });
}));
const getAllPayments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield payment_service_1.PaymentServices.getAllPaymentsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Payments Retrieved Successfully',
        data: users,
    });
}));
exports.PaymentControllers = {
    createClientSecret,
    getAllPayments,
    createPayment,
};
