import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { RentalControllers } from "./rental.controller";
import { createRentalValidationSchema } from "./rental.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(createRentalValidationSchema),
  RentalControllers.createRental,
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  RentalControllers.getAllRentals,
);

router.put("/:id/return", auth(USER_ROLE.admin), RentalControllers.returnBike);

export const RentalRoutes = router;
