import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { transactionMethodServices } from "./transactionMethod.service";

// Controller to create a new transaction method
const transactionMethodCreate = catchAsync(async (req, res) => {
  const result = await transactionMethodServices.createMethodIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction method created successfully",
    data: result,
  });
});

// Controller to delete a transaction method by ID
const transactionMethodDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await transactionMethodServices.deleteMethodFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction method deleted successfully",
    data: result,
  });
});

// Controller to update a transaction method by ID
const transactionMethodUpdate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await transactionMethodServices.updateMethodInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction method updated successfully",
    data: result,
  });
});

// Controller to retrieve all transaction methods from the database
const getAllMethods = catchAsync(async (req, res) => {
  const result = await transactionMethodServices.getAllMethodsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction methods retrieved successfully",
    data: result,
  });
});
// Controller to retrieve all companies transaction methods from the database
const getAllCompanyMethods = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await transactionMethodServices.getAllCompanyMethodsFromDB(id,req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction methods retrieved successfully",
    data: result,
  });
});

const getOneMethod = catchAsync(async (req, res) => {
  const { id } = req.params;
    const result = await transactionMethodServices.getOneMethodFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction method retrieved successfully",
      data: result,
    })
  })

export const transactionMethodControllers = {
  transactionMethodCreate,
  transactionMethodDelete,
  transactionMethodUpdate,
  getAllMethods, getOneMethod, getAllCompanyMethods
};
