/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin" | "company";
  status: "block" | "active";
  isDeleted: boolean;
  authroized: boolean;
  address?: string;
  image?: string;
  createdBy: Types.ObjectId;
  otp?: string;
  otpExpiry ?: Date
  companyId?: Types.ObjectId;
  
  
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExists(email: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  // isJWTIssuedBeforePasswordChanged(
  //   passwordChangedTimestamp: Date,
  //   jwtIssuedTimestamp: number,
  // ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
