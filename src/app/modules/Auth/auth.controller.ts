import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse, { sendLoginResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const signUpUser = catchAsync(async (req, res) => {
  const result = await AuthServices.signUpInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken, user } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendLoginResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    token: accessToken,
    message: "User logged in successfully",
    data: user,
  });
});

export const AuthControllers = {
  signUpUser,
  loginUser,
};
