import AppError from "../../errors/AppError";
import mongoose, { Model } from "mongoose";
import httpStatus from "http-status";
import { TMethod } from "./transactionMethod.interface";
import Method from "./transactionMethod.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { transactionMethodSearchableFields } from "./transactionMethod.constant";

// Creates a new transaction method in the database after validating for duplicates
const createMethodIntoDB = async (payload: TMethod) => {
  try {
    // Check if the method name already exists
    const existingMethod = await Method.findOne({ name: payload.name });
    if (existingMethod) {
      throw new AppError(httpStatus.CONFLICT, "This method name already exists!");
    }

    // Create and save the method
    const result = await Method.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createMethodIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create method");
  }
};

// Deletes a transaction method from the database by ID 
const deleteMethodFromDB = async (payload: any) => {
  try {
    // Validate the payload ID
    if (!mongoose.Types.ObjectId.isValid(payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    // Check if the method exists
    const existingMethod = await Method.findById(payload);
    if (!existingMethod) {
      throw new AppError(httpStatus.NOT_FOUND, "Method not found!");
    }

    // Delete the method
    const result = await Method.findByIdAndDelete(payload);
    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the method");
    }

    return result;
  } catch (error) {
    console.error("Error in deleteMethodFromDB:", error);

    // Re-throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,  "Failed to delete method");
  }
};

// Updates a transaction method in the database by ID 
const updateMethodInDB = async (id: string, payload: Partial<TMethod>) => {
  const result = await Method.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  return result;
};

// Retrieves all transaction methods from the database with support for filtering, sorting, and pagination
const getAllMethodsFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Method.find(), query)
    .search(transactionMethodSearchableFields)
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

// Retrieves a single transaction method from the database by ID
const getOneMethodFromDB = async (id: string) => {
  const result = await Method.findById(id);
  return result;
};

export const transactionMethodServices = {
  createMethodIntoDB,
  deleteMethodFromDB,
  updateMethodInDB,
  getAllMethodsFromDB,
  getOneMethodFromDB
};
