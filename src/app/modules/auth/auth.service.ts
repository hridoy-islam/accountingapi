import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TCreateUser, TLogin } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";

const checkLogin = async (payload: TLogin) => {
  try {
    const foundUser = await User.isUserExists(payload.email);
    if (!foundUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Login Detials is not correct");
    }
    if (foundUser.isDeleted) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "This Account Has Been Deleted."
      );
    }

    if (!(await User.isPasswordMatched(payload?.password, foundUser?.password)))
      throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

    const accessToken = jwt.sign(
      {
        _id: foundUser._id?.toString(),
        email: foundUser?.email,
        name: foundUser?.name,
        role: foundUser?.role,
        companyId: foundUser?.companyId,
      },
      `${config.jwt_access_secret}`,
      {
        expiresIn: "4d",
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: foundUser._id?.toString(),
        email: foundUser?.email,
        name: foundUser?.name,
        role: foundUser?.role,
        companyId: foundUser?.companyId,
      },
      `${config.jwt_refresh_secret}`,
       {
        expiresIn: "7d", 
      }
    );
    await User.updateOne({ _id: foundUser._id }, { refreshToken });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new AppError(httpStatus.NOT_FOUND, "Details doesnt match");
  }
};



const refreshToken = async (token: string) => {
  if (!token || typeof token !== "string") {
    throw new AppError(httpStatus.BAD_REQUEST, "Refresh token is required and should be a valid string.");
  }

  // 🔥 Check if the token exists in the database
  const foundUser = await User.findOne({ 
    refreshToken: { $eq: token } });

  

  if (!foundUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid refresh token");
  }

  try {
    const decoded = jwt.verify(token,  `${config.jwt_refresh_secret}`,);

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        _id: foundUser._id.toString(),
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        companyId: foundUser?.companyId,
      },
      `${config.jwt_access_secret}`,
      { expiresIn: "4d" }
    );

    // Generate new refresh token (optional rotation)
    const newRefreshToken = jwt.sign(
      {
        _id: foundUser._id.toString(),
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        companyId: foundUser?.companyId,
      },
      `${config.jwt_refresh_secret}`,
      { expiresIn: "7d" }
    );

    foundUser.refreshToken = newRefreshToken;
    await foundUser.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Refresh Token");
  }
};

// const refreshToken = async (token: string) => {
//   if (!token || typeof token !== "string" || token.trim() === "") {
//     throw new AppError(httpStatus.BAD_REQUEST, "Refresh token is required and should be a valid string.");
//   }

//   try {
//     console.log("🔑 Incoming Refresh Token:", token);

//     // ✅ Step 1: Verify token structure and signature
//     const decoded = jwt.verify(token, `${config.jwt_refresh_secret}`) as jwt.JwtPayload;
//     console.log("🔍 Decoded Token Payload:", decoded);

//     if (!decoded?._id) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Invalid token payload - missing user ID");
//     }

//     // ✅ Step 2: Find user with refreshToken explicitly selected
//     const foundUser = await User.findById(decoded._id).select('+refreshToken');
//     console.log("👤 Found User Document:", JSON.stringify(foundUser, null, 2));

//     if (!foundUser) {
//       throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }

//     // ✅ Step 3: Verify token matches stored token
//     if (!foundUser.refreshToken) {
//       console.error("❌ No refresh token stored for user");
//       throw new AppError(httpStatus.UNAUTHORIZED, "No refresh token found for user");
//     }

//     // Deep comparison of tokens
//     if (foundUser.refreshToken !== token) {
//       console.error("🔴 Token Mismatch Details:", {
//         incomingTokenLength: token.length,
//         storedTokenLength: foundUser.refreshToken.length,
//         incomingFirst10: token.substring(0, 10),
//         storedFirst10: foundUser.refreshToken.substring(0, 10),
//         incomingLast10: token.substring(token.length - 10),
//         storedLast10: foundUser.refreshToken.substring(foundUser.refreshToken.length - 10),
//       });
//       throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token mismatch");
//     }

//     // ✅ Step 4: Generate new tokens
//     const tokenPayload = {
//       _id: foundUser._id.toString(),
//       email: foundUser.email,
//       name: foundUser.name,
//       role: foundUser.role,
//     };

//     const newAccessToken = jwt.sign(
//       tokenPayload,
//       `${config.jwt_access_secret}`,
//       { expiresIn: "1m" } // More reasonable expiration
//     );

//     const newRefreshToken = jwt.sign(
//       tokenPayload,
//       `${config.jwt_refresh_secret}`,
//       { expiresIn: "7d" }
//     );

//     // ✅ Step 5: Update user with new refresh token atomically
//     const updatedUser = await User.findByIdAndUpdate(
//       foundUser._id,
//       { $set: { refreshToken: newRefreshToken } },
//       { new: true, select: '+refreshToken' }
//     );

//     if (!updatedUser) {
//       throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update user token");
//     }

//     console.log("🔄 Updated User Refresh Token:", {
//       oldToken: foundUser.refreshToken,
//       newToken: updatedUser.refreshToken
//     });

//     return {
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//       user: {
//         _id: foundUser._id,
//         email: foundUser.email,
//         name: foundUser.name,
//         role: foundUser.role
//       }
//     };

//   } catch (err: any) {
//     console.error("🔥 Token Refresh Error:", {
//       errorName: err.name,
//       errorMessage: err.message,
//       stack: err.stack,
//       token: token ? `Length: ${token.length}` : 'Missing'
//     });

//     if (err.name === "TokenExpiredError") {
//       throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token expired - please login again");
//     } else if (err.name === "JsonWebTokenError") {
//       throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token - malformed");
//     } else if (err instanceof AppError) {
//       throw err; // Re-throw existing AppError instances
//     } else {
//       throw new AppError(
//         httpStatus.INTERNAL_SERVER_ERROR,
//         "Authentication service unavailable",
//         "AUTH_SERVICE_ERROR",
//         { originalError: err.message }
//       );
//     }
//   }
// };


const createUserIntoDB = async (payload: TCreateUser) => {
  const user = await User.isUserExists(payload.email);
  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is already exits!");
  }
  const result = await User.create(payload);
  return result;
};

const forgetPassword = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );
  const resetUILink = `${config.reset_pass_ui_link}?id=${user.email}&token=${resetToken} `;
  sendEmail(user.email, resetUILink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const user = await User.isUserExists(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    { email: decoded.email, role: decoded.role },
    {
      password: newHashedPassword,
    }
  );
};

export const AuthServices = {
  checkLogin,
  createUserIntoDB,
  resetPassword,
  forgetPassword,
  refreshToken,

};
