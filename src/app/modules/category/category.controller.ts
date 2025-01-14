import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CategoryServices } from "./category.service";


// Controller to create a new category method
const categoryCreate = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategoryIntoDB(req.body);
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
  const result = await CategoryServices.deleteCategoryFromDB(id);
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
  const result = await CategoryServices.updateCategoryInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category method updated successfully",
    data: result,
  });
});

// Controller to retrieve all category methods from the database
const getAllCategorys = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategorysFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category methods retrieved successfully",
    data: result,
  });
});

const getOneCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
    const result = await CategoryServices.getOneCategoryFromDB(id);
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
  getAllCategorys,
  getOneCategory


 
};
