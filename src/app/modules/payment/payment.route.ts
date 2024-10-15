import express from "express";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

router.post(
  "/create-payment-intent",
  PaymentControllers.createClientSecret,
);

router.post(
  "/",
  PaymentControllers.createPayment,
);

router.get(
  "/",
  PaymentControllers.getAllPayments,
);

export const PaymentRoutes = router;




