import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { InvoiceServices } from "./invoice.service";

// Controller to create a new invoice
const createInvoice: RequestHandler = catchAsync(async (req, res) => {
  const result = await InvoiceServices.createInvoiceIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice created successfully",
    data: result,
  });
});

// Controller to delete an invoice by ID
const deleteInvoice: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InvoiceServices.deleteInvoiceFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice deleted successfully",
    data: result,
  });
});

// Controller to update an invoice by ID
const updateInvoice: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InvoiceServices.updateInvoiceInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice updated successfully",
    data: result,
  });
});

// Controller to retrieve all invoices from the database
const getAllInvoices: RequestHandler = catchAsync(async (req, res) => {
  const result = await InvoiceServices.getAllInvoicesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoices retrieved successfully",
    data: result,
  });
});

// Controller to retrieve a single invoice by ID
const getOneInvoice: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InvoiceServices.getOneInvoiceFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invoice retrieved successfully",
    data: result,
  });
});

// Controller to retrieve all invoices for a specific company
const getAllCompanyInvoices: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InvoiceServices.getAllCompanyInvoicesFromDB(id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company invoices retrieved successfully",
    data: result,
  });
});

export const InvoiceControllers = {
  createInvoice,
  deleteInvoice,
  updateInvoice,
  getAllInvoices,
  getOneInvoice,
  getAllCompanyInvoices,
};
 