import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { updateUserValidationSchema } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.get(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getProfile,
);

router.put(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(updateUserValidationSchema),
  UserControllers.updateProfile,
);

export const UserRoutes = router;
