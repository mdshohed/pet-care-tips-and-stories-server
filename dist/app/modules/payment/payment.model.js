"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
