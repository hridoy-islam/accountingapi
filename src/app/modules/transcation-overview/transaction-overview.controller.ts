import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { StorageServices } from "./transaction-overview.service";

const getCompanyStorage = catchAsync(async (req, res) => {
  const { id } = req.params;
    const result = await StorageServices.getAllCompanyStoragesFromDB(id,req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Storage method retrieved successfully",
      data: result,
    })
  })

export const storageControllers = {

  getCompanyStorage


 
};
