import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TransactionServices } from "./transaction.service";

// Controller to create a new transaction method
const transactionCreate = catchAsync(async (req, res) => {
  try {
    // Ensure the file is correctly handled if present
    const { file } = req; // Multer will attach the file to the request if it's uploaded
    const {
      tcid,
      transactionDate,
      invoiceNumber,
      invoiceDate,
      details,
      description,
      storage,
      companyId,
      transactionType,
      transactionAmount,
      transactionCategory,
      transactionMethod,
    } = req.body;

    // Construct the file URL
    const fileUrl = file ? `/uploads/transactions/${file.filename}` : undefined;

    // Construct the payload, including the file URL in transactionDoc
    const payload = {
      tcid,
      transactionDate,
      invoiceNumber,
      invoiceDate,
      details,
      description,
      storage,
      companyId,
      transactionDoc: fileUrl, // Storing the URL of the uploaded file,
      transactionType,
      transactionAmount,
      transactionCategory,
      transactionMethod,
    };

    // Call the service to create the transaction in the database
    const result = await TransactionServices.createTransactionIntoDB(payload);

    // Send the response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in transactionCreate controller:", error);
    const typedError = error as { statusCode?: number; message?: string };
    sendResponse(res, {
      statusCode: typedError.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message:
        typedError.message ||
        "An error occurred while creating the transaction.",
      data: null,
    });
  }
});

// Controller to delete a transaction method by ID
const transactionDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TransactionServices.deleteTransactionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction method deleted successfully",
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
    message: "transaction method updated successfully",
    data: result,
  });
});

// Controller to retrieve all transaction methods from the database
const getAlltransactions = catchAsync(async (req, res) => {
  const result = await TransactionServices.getAllTransactionsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction methods retrieved successfully",
    data: result,
  });
});

const getOnetransaction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TransactionServices.getOneTransactionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transaction method retrieved successfully",
    data: result,
  });
});

export const transactionControllers = {
  transactionCreate,
  transactionDelete,
  transactionUpdate,
  getAlltransactions,
  getOnetransaction,
};
