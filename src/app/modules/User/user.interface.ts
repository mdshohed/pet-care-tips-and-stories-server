import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "admin" | "user";
  isDeleted?: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

// @typescript-eslint/no-unused-vars
export type TUserRole = keyof typeof USER_ROLE;
