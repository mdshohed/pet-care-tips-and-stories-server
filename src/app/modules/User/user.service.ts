import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "./user.model";
import config from "../../config";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";

const getProfileFromDB = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userEmail } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  return user;
};

const updateProfileIntoDB = async (token: string, payload: Partial<TUser>) => {
  // checking if the given token is valid

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userEmail } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  const filter = { email: userEmail };

  // const result = await User.findByIdAndUpdate(filter, payload, {
  const result = await User.findOneAndUpdate(filter, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const UserServices = {
  getProfileFromDB,
  updateProfileIntoDB,
};
