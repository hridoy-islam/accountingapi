/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";
import config from "../../config";
import { UserStatus } from "./user.constant";
import { TUser, UserModel } from "./user.interface";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin","company","manager","administrator","audit"],
      default: "user",
    },
    status: {
      type: String,
      enum: UserStatus,
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    authroized: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      default:""
    },
    imageUrl: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    themeColor:{
      type: String,
      default:"#a78bfa"
    },
    sortCode: { type: String },
    accountNo: { type: String },
    beneficiary: { type: String },
    refreshToken: {
      type: String,
      select:false
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function(next) {
  // Only hash the password if it's being modified
  if (this.isModified('password')) {
    if (!this.password) {
      return next(new Error("Password is required"));
    }

    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>("User", userSchema);
