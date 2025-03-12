import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import { invoiceSearchableFields } from "./invoice.constant";
import { TInvoice } from "./invoice.interface";
import Invoice from "./invoice.model";

// Creates a new Invoice in the database
const createInvoiceIntoDB = async (payload: TInvoice) => {
  try {
    const result = await Invoice.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createInvoiceIntoDB:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Invoice");
  }
};

// Deletes an Invoice from the database by ID
const deleteInvoiceFromDB = async (id: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      throw new AppError(httpStatus.NOT_FOUND, "Invoice not found!");
    }

    // Soft delete (optional)
    const result = await Invoice.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the Invoice");
    }

    return result;
  } catch (error) {
    console.error("Error in deleteInvoiceFromDB:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete Invoice");
  }
};

// Updates an Invoice in the database by ID
const updateInvoiceInDB = async (id: string, payload: Partial<TInvoice>) => {
  const result = await Invoice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice not found!");
  }

  return result;
};

// Retrieves all Invoices from the database with filtering, sorting, and pagination
const getAllInvoicesFromDB = async (query: Record<string, unknown>) => {
  const invoiceQuery = new QueryBuilder(Invoice.find(), query)
    .search(invoiceSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await invoiceQuery.countTotal();
  const result = await invoiceQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// Retrieves all Invoices for a specific company with filtering, sorting, and pagination
const getAllCompanyInvoicesFromDB = async (companyId: string, query: Record<string, unknown>) => {
  const invoiceQuery = new QueryBuilder(Invoice.find({ companyId }).populate("companyId"), query)
    .search(invoiceSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await invoiceQuery.countTotal();
  const result = await invoiceQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// Retrieves a single Invoice from the database by ID
const getOneInvoiceFromDB = async (id: string) => {
  const result = await Invoice.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice not found!");
  }
  return result;
};

export const InvoiceServices = {
  createInvoiceIntoDB,
  deleteInvoiceFromDB,
  updateInvoiceInDB,
  getAllInvoicesFromDB,
  getOneInvoiceFromDB,
  getAllCompanyInvoicesFromDB,
};
