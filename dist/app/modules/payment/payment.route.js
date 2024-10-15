"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post("/create-payment-intent", payment_controller_1.PaymentControllers.createClientSecret);
router.post("/", payment_controller_1.PaymentControllers.createPayment);
router.get("/", payment_controller_1.PaymentControllers.getAllPayments);
exports.PaymentRoutes = router;
