import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import { pendingTransactionSearchableFields } from "./pending.constant";
import { TPendingTransaction } from "./pending.interface";
import PendingTransaction from "./pending.model";
import moment from "moment";

const createPendingTransactionIntoDB = async (payload: TPendingTransaction) => {
  try {
    const result = await PendingTransaction.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createPendingTransactionIntoDB:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create PendingTransaction");
  }
};
const createPendingTransactionFromExternal = async (payload: any, companyId: any) => {
  const {
    transactionType,
    invoiceDate,
    invoiceNumber,
    description,
    amount,
   
  } = payload;

  // Validate company ID
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid company ID");
  }

  // Validate required fields
  const requiredFields = [
    "transactionType",
    "invoiceDate",
    "invoiceNumber",
    "description",
    "amount",
    
  ];
  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new AppError(httpStatus.BAD_REQUEST, `Missing required field: ${field}`);
    }
  }


  // Prepare the transaction data
  const transactionData = {
  
    companyId,
    transactionType,
    invoiceDate: new Date(invoiceDate),
    invoiceNumber,
    description,
    amount: parseFloat(amount),
  };

  // Create and save the transaction
  const pendingTransaction = new PendingTransaction(transactionData);
  await pendingTransaction.save();

  return pendingTransaction;
};

// Deletes an PendingTransaction from the database by ID
const deletePendingTransactionFromDB = async (id: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    const existingPendingTransaction = await PendingTransaction.findById(id);
    if (!existingPendingTransaction) {
      throw new AppError(httpStatus.NOT_FOUND, "PendingTransaction not found!");
    }

    // Soft delete (optional)
    const result = await PendingTransaction.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the PendingTransaction");
    }

    return result;
  } catch (error) {
    console.error("Error in deletePendingTransactionFromDB:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete PendingTransaction");
  }
};

// Updates an PendingTransaction in the database by ID
const updatePendingTransactionInDB = async (id: string, payload: Partial<TPendingTransaction>) => {
  const result = await PendingTransaction.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "PendingTransaction not found!");
  }

  return result;
};

// Retrieves all PendingTransactions from the database with filtering, sorting, and pagination
const getAllPendingTransactionsFromDB = async (query: Record<string, unknown>) => {
  

  const PendingTransactionQuery = new QueryBuilder(PendingTransaction.find(), query)
    .search(pendingTransactionSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await PendingTransactionQuery.countTotal();
  const result = await PendingTransactionQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// Retrieves all PendingTransactions for a specific company with filtering, sorting, and pagination
const getAllCompanyPendingTransactionsFromDB = async (companyId: string, query: Record<string, unknown>) => {
  const { fromDate, toDate, searchTerm, ...otherQueryParams } = query;

  const baseQuery: any = { 
    companyId,
    isDeleted: false 
  };

  if (fromDate && toDate) {
    baseQuery.invoiceDate = {
      $gte: moment(fromDate).startOf('day').toDate(),
      $lte: moment(toDate).endOf('day').toDate()
    };
  } else if (fromDate) {
    baseQuery.invoiceDate = {
      $gte: moment(fromDate).startOf('day').toDate()
    };
  } else if (toDate) {
    baseQuery.invoiceDate = {
      $lte: moment(toDate).endOf('day').toDate()
    };
  }

  // Initialize QueryBuilder with the base query
  const PendingTransactionQuery = new QueryBuilder(
    PendingTransaction.find(baseQuery).populate("companyId","name"),
    otherQueryParams
  );

  // Handle search term if provided
  if (searchTerm) {
    const searchTermStr = searchTerm.toString();
    PendingTransactionQuery.modelQuery = PendingTransactionQuery.modelQuery.or([
      { invoiceNumber: { $regex: searchTermStr, $options: 'i' } },
      { details: { $regex: searchTermStr, $options: 'i' } },
     
    ]);
  }

  // Apply other QueryBuilder methods
  const finalQuery = PendingTransactionQuery
    .filter()
    .sort()
    .paginate()
    .fields();

  // Get results
  const meta = await finalQuery.countTotal();
  const result = await finalQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// Retrieves a single PendingTransaction from the database by ID
const getOnePendingTransactionFromDB = async (id: string) => {
  const result = await PendingTransaction.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Pending Transaction not found!");
  }
  return result;
};

export const PendingTransactionServices = {
  createPendingTransactionIntoDB,
  deletePendingTransactionFromDB,
  updatePendingTransactionInDB,
  getAllPendingTransactionsFromDB,
  getOnePendingTransactionFromDB,
  getAllCompanyPendingTransactionsFromDB,
  createPendingTransactionFromExternal
};
