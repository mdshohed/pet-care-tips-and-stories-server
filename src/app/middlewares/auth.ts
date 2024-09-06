import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { TUserRole } from "../modules/User/user.interface";
import { User } from "../modules/User/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // console.log(authHeader);
    const token = authHeader?.split(' ')[1];

    // checking if the token is missing
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route",
      );
    }

    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route",
      );
    }

    // checking if the given token is valid
    const decoded = (jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload);

    const decoded2 = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret as string,
    ) as JwtPayload; 


    let { role, userEmail } = decoded;
    let { role: role2, userEmail: userEmail2 } = decoded2;
    console.log(role, userEmail, role2, userEmail2);
    
    // checking if the user is exist
    const user = await User.isUserExistsByCustomEmail(userEmail);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "You have no access to this route");
    }
    
    if ( (!role.includes(role2)) || ( !userEmail.includes(userEmail2)) ) {
      console.log(role2, userEmail2);
      throw new AppError(httpStatus.NOT_FOUND, "You have no access to this route");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route",
      );
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
