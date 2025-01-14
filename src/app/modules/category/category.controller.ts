import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { categoryServices } from "./category.service";


// Controller to create a new category method
const categoryCreate = catchAsync(async (req, res) => {
  const result = await categoryServices.createcategoryIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category method created successfully",
    data: result,
  });
});

// Controller to delete a category method by ID
const categoryDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryServices.deletecategoryFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category method deleted successfully",
    data: result,
  });
});

// Controller to update a category method by ID
const categoryUpdate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryServices.updatecategoryInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category method updated successfully",
    data: result,
  });
});

// Controller to retrieve all category methods from the database
const getAllcategorys = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllcategorysFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category methods retrieved successfully",
    data: result,
  });
});

const getOnecategory = catchAsync(async (req, res) => {
  const { id } = req.params;
    const result = await categoryServices.getOnecategoryFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "category method retrieved successfully",
      data: result,
    })
  })

export const categoryControllers = {
  categoryCreate,
  categoryDelete,
  categoryUpdate,
  getAllcategorys,
  getOnecategory


 
};
