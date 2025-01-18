import AppError from "../../errors/AppError";
import mongoose, { Model } from "mongoose";
import httpStatus from "http-status";
import { TStorage } from "./storage.interface";
import Storage from "./storage.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { storageSearchableFields } from "./storage.constant";

// Creates a new transaction Storage in the database after validating for duplicates
const createStorageIntoDB = async (payload: TStorage) => {
  try {
    // Check if the Storage name already exists
    const existingStorage= await Storage.findOne({ name: payload.storageName });
    if (existingStorage) {
      throw new AppError(httpStatus.CONFLICT, "This storage name already exists!");
    }

    // Create and save the Storage
    const result = await Storage.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createStorageIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Storage");
  }
};

// Deletes a transaction Storage from the database by ID 
const deleteStorageFromDB = async (payload: any) => {
  try {
    // Validate the payload ID
    if (!mongoose.Types.ObjectId.isValid(payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    // Check if the Storage exists
    const existingStorage = await Storage.findById(payload);
    if (!existingStorage) {
      throw new AppError(httpStatus.NOT_FOUND, "Storage not found!");
    }

    // Delete the Storage
    const result = await Storage.findByIdAndDelete(payload);
    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the Storage");
    }

    return result;
  } catch (error) {
    console.error("Error in deleteStorageFromDB:", error);

    // Re-throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,  "Failed to delete Storage");
  }
};

// Updates a transaction Storage in the database by ID 
const updateStorageInDB = async (id: string, payload: Partial<TStorage>) => {
  const result = await Storage.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  return result;
};

// Retrieves all transaction Storages from the database with support for filtering, sorting, and pagination
const getAllStoragesFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Storage.find().populate('companyId'), query)
    .search(storageSearchableFields)
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

// Retrieves a single transaction Storage from the database by ID
const getOneStorageFromDB = async (id: string) => {
  const result = await Storage.findById(id);
  return result;
};

export const StorageServices = {
  createStorageIntoDB,
  deleteStorageFromDB,
  updateStorageInDB,
  getAllStoragesFromDB,
  getOneStorageFromDB
};
