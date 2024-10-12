import express from "express";
import { StripeControllers } from "./stripe.controller";

const router = express.Router();

router.post(
  "/",
  StripeControllers.createPayment,
);


export const StripeRoutes = router;




