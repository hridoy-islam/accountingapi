import AppError from "../../errors/AppError";
import mongoose, { Model } from "mongoose";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { TCompany } from "./company.interface";
import Company from "./company.model";
import { companySearchableFields } from "./company.constant";
import { User } from "../user/user.model";
import { TUser } from "../user/user.interface";


// Creates a new Company  in the database after validating for duplicates
const createCompanyIntoDB = async (payload: TCompany) => {
  try {
    // Check if the Company already exists
    const existingCompany= await Company.findOne({ companyName: payload.companyName });
    if (existingCompany) {
      throw new AppError(httpStatus.CONFLICT, "This Company name already exists!");
    }

    // Create and save the Company
    const result = await Company.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createCompanyIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Company");
  }
};


// Deletes a Company Company from the database by ID 
const deleteCompanyFromDB = async (payload: any) => {
  try {
    // Validate the payload ID
    if (!mongoose.Types.ObjectId.isValid(payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    // Check if the Company exists
    const existingCompany = await Company.findById(payload);
    if (!existingCompany) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");
    }

    // Delete the Company
    const result = await Company.findByIdAndDelete(payload);
    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the Company");
    }

    return result;
  } catch (error) {
    console.error("Error in deleteCompanyFromDB:", error);

    // Re-throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,  "Failed to delete Company");
  }
};

// Updates a  Company in the database by ID 
const updateCompanyInDB = async (id: string, payload: Partial<TCompany>) => {
  try {
    // Validate company ID
    const company = await Company.findById(id);
    if (!company) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found");
    }

    // Handle assigning users if assignUser is present in the payload
    if (payload.assignUser && payload.assignUser.length > 0) {
      // Validate that the user IDs exist
      const users = await User.find({ _id: { $in: payload.assignUser } });
      if (users.length !== payload.assignUser.length) {
        throw new AppError(httpStatus.BAD_REQUEST, "One or more user IDs are invalid");
      }

      // Ensure no duplicate user IDs are added to assignUser
      const existingUserIds = new Set(company.assignUser || []);
      const newUserIds = payload.assignUser.filter((userId) => !existingUserIds.has(userId));

      if (newUserIds.length > 0) {
        company.assignUser = [...existingUserIds, ...newUserIds];
      }

      // Remove `assignUser` from the payload to avoid overwriting during update
      delete payload.assignUser;
    }

    // Update other fields in the company document
    Object.assign(company, payload);

    // Save the updated company document
    const result = await company.save();

    return result;
  } catch (error: any) {
    console.error("Error in updateCompanyInDB:", error);

    // Re-throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update the company"
    );
  }
};

// Retrieves all  Companys from the database with support for filtering, sorting, and pagination
const getAllCompanysFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Company.find(), query)
    .search(companySearchableFields)
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



// Retrieves a single  Company from the database by ID
const getOneCompanyFromDB = async (id: string) => {
  const result = await Company.findById(id);
  return result;
};



export const CompanyServices = {
  createCompanyIntoDB,
  deleteCompanyFromDB,
  updateCompanyInDB,
  getAllCompanysFromDB,
  getOneCompanyFromDB,

};
