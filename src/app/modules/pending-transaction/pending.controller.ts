import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PendingTransactionServices } from "./pending.service";

// Controller to create a new PendingTransaction
const createPendingTransaction: RequestHandler = catchAsync(async (req, res) => {
  const result = await PendingTransactionServices.createPendingTransactionIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending Transaction created successfully",
    data: result,
  });
});

// Controller to delete an PendingTransaction by ID
const deletePendingTransaction: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PendingTransactionServices.deletePendingTransactionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending Transaction deleted successfully",
    data: result,
  });
});

// Controller to update an PendingTransaction by ID
const updatePendingTransaction: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PendingTransactionServices.updatePendingTransactionInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending Transaction updated successfully",
    data: result,
  });
});

// Controller to retrieve all PendingTransactions from the database
const getAllPendingTransactions: RequestHandler = catchAsync(async (req, res) => {
  const result = await PendingTransactionServices.getAllPendingTransactionsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending Transactions retrieved successfully",
    data: result,
  });
});

// Controller to retrieve a single PendingTransaction by ID
const getOnePendingTransaction: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PendingTransactionServices.getOnePendingTransactionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending Transaction retrieved successfully",
    data: result,
  });
});

// Controller to retrieve all PendingTransactions for a specific company
const getAllCompanyPendingTransactions: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PendingTransactionServices.getAllCompanyPendingTransactionsFromDB(id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company Pending Transactions retrieved successfully",
    data: result,
  });
});


const storePendingTransaction = catchAsync(async (req, res) => {
  // Extract x-company-token from headers
  const companyId = req.headers['x-company-token'];

  if (!companyId) {
    throw new Error("Company ID is missing in the headers");
  }

  // Create transaction using the extracted companyId
  const result = await PendingTransactionServices.createPendingTransactionFromExternal(
    req.body,
    companyId
  );

  // Return success response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction created successfully",
    data: result,
  });
});

export const PendingTransactionControllers = {
  createPendingTransaction,
  deletePendingTransaction,
  updatePendingTransaction,
  getAllPendingTransactions,
  getOnePendingTransaction,
  getAllCompanyPendingTransactions,
  storePendingTransaction
};
 