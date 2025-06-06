import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CompanyServices } from "./company.service";


// Controller to create a new company 
const companyCreate = catchAsync(async (req, res) => {
  const result = await CompanyServices.createCompanyIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "company created successfully",
    data: result,
  });
});

// Controller to delete a company method by ID
const companyDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CompanyServices.deleteCompanyFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "company deleted successfully",
    data: result,
  });
});

// Controller to update a company by ID
const companyUpdate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CompanyServices.updateCompanyInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "company method updated successfully",
    data: result,
  });
});

// Controller to retrieve all company methods from the database
const getAllcompanys = catchAsync(async (req, res) => {
  const result = await CompanyServices.getAllCompanysFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "company methods retrieved successfully",
    data: result,
  });
});

const getOnecompany = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CompanyServices.getOneCompanyFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "company method retrieved successfully",
    data: result,
  })
})

const assignUser = catchAsync(async (req, res) => {
  const { companyId, userId } = req.params;
  const result = await CompanyServices.addUserToCompany(companyId, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "company assign user added successfully",
    data: result,
  })
})

const removeAssignUser = catchAsync(async (req, res) => {
  const { companyId, userId } = req.params;
  const result = await CompanyServices.removeUserFromCompany(companyId, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "company assign user removed successfully",
    data: result,
  })
})


export const companyControllers = {
  companyCreate,
  companyDelete,
  companyUpdate,
  getAllcompanys,
  getOnecompany,
  assignUser,
  removeAssignUser
};
