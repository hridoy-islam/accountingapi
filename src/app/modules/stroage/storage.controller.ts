import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { StorageServices } from "./storage.service";

// Controller to create a new Storage method
const storageCreate = catchAsync(async (req, res) => {
  const result = await StorageServices.createStorageIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Storage created successfully",
    data: result,
  });
});

// Controller to delete a Storage method by ID
const storageDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StorageServices.deleteStorageFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Storage deleted successfully",
    data: result,
  });
});

// Controller to update a Storage method by ID
const storageUpdate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StorageServices.updateStorageInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Storage updated successfully",
    data: result,
  });
});

// Controller to retrieve all Storage methods from the database
const getAllStorages = catchAsync(async (req, res) => {
  const result = await StorageServices.getAllStoragesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Storage methods retrieved successfully",
    data: result,
  });
});

const getOneStorage = catchAsync(async (req, res) => {
  const { id } = req.params;
    const result = await StorageServices.getOneStorageFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Storage method retrieved successfully",
      data: result,
    })
  })

export const storageControllers = {
  storageCreate,
  storageDelete,
  storageUpdate,
  getAllStorages,
  getOneStorage


 
};
