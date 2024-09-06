import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { createUserValidationSchema } from "../User/user.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(createUserValidationSchema),
  AuthControllers.signUpUser,
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

export const AuthRoutes = router;
