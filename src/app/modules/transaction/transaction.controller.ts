import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TransactionServices } from "./transaction.service";

// Controller to create a new transaction method
const transactionCreate = catchAsync(async (req, res) => {
  const result = await TransactionServices.createTransactionIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction created successfully",
    data: result,
  });
});



const uploadCsv = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const result = await TransactionServices.uploadCsvToDB(companyId, req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CSV Uploaded successfully",
    data: result,
  });
});

// Controller to delete a transaction method by ID
const transactionDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TransactionServices.deleteTransactionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction  deleted successfully",
    data: result,
  });
});

// Controller to update a transaction method by ID
const transactionUpdate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TransactionServices.updateTransactionInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction  updated successfully",
    data: result,
  });
});

// Controller to retrieve all transaction methods from the database
const getAlltransactions = catchAsync(async (req, res) => {
  const result = await TransactionServices.getAllTransactionsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction  retrieved successfully",
    data: result,
  });
});

const getOnetransaction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TransactionServices.getOneTransactionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction  retrieved successfully",
    data: result,
  });
});
const getAllCompanytransactions= catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TransactionServices.getAllCompanyTransactionsFromDB(id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction  retrieved successfully",
    data: result,
  });
});
const getyearlyCompanytransactions= catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TransactionServices.getYearlyCompanyTransactionsFromDB(id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction  retrieved successfully",
    data: result,
  });
});


export const transactionControllers = {
  transactionCreate,
  transactionDelete,
  transactionUpdate,
  getAlltransactions,
  getOnetransaction,
  getAllCompanytransactions,
  getyearlyCompanytransactions

};
