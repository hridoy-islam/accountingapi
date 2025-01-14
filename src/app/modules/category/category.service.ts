import AppError from "../../errors/AppError";
import mongoose, { Model } from "mongoose";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";


import Category from "./category.model";
import { categorySearchableFields } from "./category.constant";
import { TCategory } from "./category.interface";

// Creates a new Category  in the database after validating for duplicates
const createCategoryIntoDB = async (payload: TCategory) => {
  try {
    // Check if the Category tcid already exists
    const existingCategory= await Category.findOne({ categoryName: payload.categoryName });
    if (existingCategory) {
      throw new AppError(httpStatus.CONFLICT, "This Category name already exists!");
    }

    // Create and save the Category
    const result = await Category.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createCategoryIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
  }
};


// Deletes a Category Category from the database by ID 
const deleteCategoryFromDB = async (payload: any) => {
  try {
    // Validate the payload ID
    if (!mongoose.Types.ObjectId.isValid(payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    // Check if the Category exists
    const existingCategory = await Category.findById(payload);
    if (!existingCategory) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
    }

    // Delete the Category
    const result = await Category.findByIdAndDelete(payload);
    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the Category");
    }

    return result;
  } catch (error) {
    console.error("Error in deleteCategoryFromDB:", error);

    // Re-throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,  "Failed to delete Category");
  }
};

// Updates a  Category in the database by ID 
const updateCategoryInDB = async (id: string, payload: Partial<TCategory>) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  return result;
};

// Retrieves all  Categorys from the database with support for filtering, sorting, and pagination
const getAllCategorysFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Category.find(), query)
    .search(categorySearchableFields)
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

// Retrieves a single  Category from the database by ID
const getOneCategoryFromDB = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  deleteCategoryFromDB,
  updateCategoryInDB,
  getAllCategorysFromDB,
  getOneCategoryFromDB
};
