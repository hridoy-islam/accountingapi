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
    message: "company method created successfully",
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
    message: "company method deleted successfully",
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


  const assignUsersToCompany = catchAsync(async (req, res)=>{
    
  })

export const companyControllers = {
  companyCreate,
  companyDelete,
  companyUpdate,
  getAllcompanys,
  getOnecompany


 
};
