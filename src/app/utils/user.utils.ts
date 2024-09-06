import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export const currentUser = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  return decoded;
};
