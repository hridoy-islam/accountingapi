import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const login = catchAsync(async (req, res) => {
  const ipaddress = req.ip;
  const result = await AuthServices.checkLogin(req.body, ipaddress as string);
  const { accessToken } = result;

  // res.cookie('refreshToken', refreshToken, {
  //   secure: config.NODE_ENV === 'production',
  //   httpOnly: true,
  // });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged In Successfully",
    data: {
      accessToken,
      ipaddress,

    },
  });
});

const createUser = catchAsync(async (req, res) => {
  const result = await AuthServices.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Created Successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await AuthServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link is generated succesfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthServices.resetPassword(req.body, token as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset succesful!",
    data: result,
  });
});

export const AuthControllers = {
  login,
  createUser,
  forgetPassword,
  resetPassword,
};
