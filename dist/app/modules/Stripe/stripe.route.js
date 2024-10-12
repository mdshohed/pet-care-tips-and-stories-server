"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const stripe_controller_1 = require("./stripe.controller");
const router = express_1.default.Router();
router.post("/", stripe_controller_1.StripeControllers.createPayment);
exports.StripeRoutes = router;
