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
  const result = await Company.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  return result;
};

// Retrieves all  Companys from the database with support for filtering, sorting, and pagination
const getAllCompanysFromDB = async (query: Record<string, unknown>) => {
  // Check if 'assignUser' exists in the query and modify it for array filtering
  if (query.assignUser) {
    query.assignUser = { $in: [query.assignUser] };
  }
  const userQuery = new QueryBuilder(Company.find().populate('createdBy assignUser'), query)
    .search(companySearchableFields)
    .filter(query)
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
  const result = await Company.findById(id).populate('createdBy assignUser');
  return result;
};

const addUserToCompany = async (companyId: string, userId: string) => {
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found");
    }

    // Ensure 'assignUser' is initialized as an array if it's undefined
    if (!Array.isArray(company.assignUser)) {
      company.assignUser = [];
    }

    // Add the user ID to the assignUser array if not already present
    if (!company.assignUser.includes(userId)) {
      company.assignUser.push(userId);
      await company.save();
    }

    return company;
  } catch (error: any) {
    console.error("Error in addUserToCompany:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to add user to company"
    );
  }
};

const removeUserFromCompany = async (companyId: string, userId: string) => {
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found");
    }

    // Ensure 'assignUser' is initialized as an array if it's undefined
    if (!Array.isArray(company.assignUser)) {
      company.assignUser = [];
    }

    // Check if company.assignUser contains ObjectIds or strings
    company.assignUser = company.assignUser.filter(user => user.toString() !== userId);

    await company.save();
    return company;
  } catch (error: any) {
    console.error("Error in removeUserFromCompany:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to remove user from company"
    );
  }
};







export const CompanyServices = {
  createCompanyIntoDB,
  deleteCompanyFromDB,
  updateCompanyInDB,
  getAllCompanysFromDB,
  getOneCompanyFromDB,
  addUserToCompany,
  removeUserFromCompany

};
