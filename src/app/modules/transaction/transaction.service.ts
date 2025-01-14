import AppError from "../../errors/AppError";
import mongoose, { Model } from "mongoose";
import httpStatus from "http-status";
import { TTransaction } from "./transaction.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { transactionSearchableFields } from "./transaction.constant";

import Transaction from "./transaction.model";

// Creates a new transaction  in the database after validating for duplicates
const createTransactionIntoDB = async (payload: TTransaction) => {
  try {
    // Check if the transaction tcid already exists
    const existingTransaction= await Transaction.findOne({ tcid: payload.tcid });
    if (existingTransaction) {
      throw new AppError(httpStatus.CONFLICT, "This Transaction name already exists!");
    }

    // Create and save the transaction
    const result = await Transaction.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createTransactionIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Transaction");
  }
};


// Deletes a transaction Transaction from the database by ID 
const deleteTransactionFromDB = async (payload: any) => {
  try {
    // Validate the payload ID
    if (!mongoose.Types.ObjectId.isValid(payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    // Check if the Transaction exists
    const existingTransaction = await Transaction.findById(payload);
    if (!existingTransaction) {
      throw new AppError(httpStatus.NOT_FOUND, "Transaction not found!");
    }

    // Delete the Transaction
    const result = await Transaction.findByIdAndDelete(payload);
    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the Transaction");
    }

    return result;
  } catch (error) {
    console.error("Error in deleteTransactionFromDB:", error);

    // Re-throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,  "Failed to delete Transaction");
  }
};

// Updates a  Transaction in the database by ID 
const updateTransactionInDB = async (id: string, payload: Partial<TTransaction>) => {
  const result = await Transaction.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  return result;
};

// Retrieves all  Transactions from the database with support for filtering, sorting, and pagination
const getAllTransactionsFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Transaction.find(), query)
    .search(transactionSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// Retrieves a single  Transaction from the database by ID
const getOneTransactionFromDB = async (id: string) => {
  const result = await Transaction.findById(id);
  return result;
};

export const TransactionServices = {
  createTransactionIntoDB,
  deleteTransactionFromDB,
  updateTransactionInDB,
  getAllTransactionsFromDB,
  getOneTransactionFromDB
};
