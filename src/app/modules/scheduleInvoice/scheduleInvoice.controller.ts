import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ScheduleInvoiceServices } from "./scheduleInvoice.service";

// Controller to create a new invoice
const createScheduleInvoice: RequestHandler = catchAsync(async (req, res) => {
  const result = await ScheduleInvoiceServices.createScheduleInvoiceIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ScheduleInvoice created successfully",
    data: result,
  });
});

// Controller to delete an ScheduleInvoice by ID
const deleteScheduleInvoice: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleInvoiceServices.deleteScheduleInvoiceFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ScheduleInvoice deleted successfully",
    data: result,
  });
});

// Controller to update an ScheduleInvoice by ID
const updateScheduleInvoice: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleInvoiceServices.updateScheduleInvoiceInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ScheduleInvoice updated successfully",
    data: result,
  });
});

// Controller to retrieve all ScheduleInvoices from the database
const getAllScheduleInvoices: RequestHandler = catchAsync(async (req, res) => {
  const result = await ScheduleInvoiceServices.getAllScheduleInvoicesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ScheduleInvoices retrieved successfully",
    data: result,
  });
});

// Controller to retrieve a single ScheduleInvoice by ID
const getOneScheduleInvoice: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleInvoiceServices.getOneScheduleInvoiceFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ScheduleInvoice retrieved successfully",
    data: result,
  });
});

// Controller to retrieve all ScheduleInvoices for a specific company
const getAllCompanyScheduleInvoices: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleInvoiceServices.getAllCompanyScheduleInvoicesFromDB(id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company ScheduleInvoices retrieved successfully",
    data: result,
  });
});

export const ScheduleInvoiceControllers = {
  createScheduleInvoice,
  deleteScheduleInvoice,
  updateScheduleInvoice,
  getAllScheduleInvoices,
  getOneScheduleInvoice,
  getAllCompanyScheduleInvoices,
};
 