import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import { invoiceSearchableFields } from "./invoice.constant";
import { TInvoice } from "./invoice.interface";
import Invoice from "./invoice.model";
import moment from "moment";


const generateUniqueInvId = async (): Promise<string> => {
  // const prefix = "INV";
  const now = new Date();

  const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  // Find the latest invoice with today's date
  const latestInvoice = await Invoice.findOne({ invId: { $regex: `^${dateStr}` } })
    .sort({ invId: -1 })
    .limit(1);

  let increment = 1;
  if (latestInvoice) {
    const lastInvId = latestInvoice.invId;
    const lastIncrement = parseInt(lastInvId.slice(-4), 10);
    increment = lastIncrement + 1;
  }

  const incrementStr = increment.toString().padStart(3, "0");
  return `${dateStr}${incrementStr}`;
};


// Creates a new Invoice in the database
const createInvoiceIntoDB = async (payload: TInvoice) => {
  try {
    const uniqueInvId = await generateUniqueInvId();
    const result = await Invoice.create({ ...payload, invId: uniqueInvId });
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

const getAllCompanyInvoicesFromDB = async (companyId: string, query: Record<string, unknown>) => {
  const { fromDate, toDate, searchTerm, ...otherQueryParams } = query;

  const baseQuery: any = { 
    companyId,
    isDeleted: false 
  };

  if (fromDate && toDate) {
    baseQuery.createdAt = {
      $gte: moment(fromDate).startOf('day').toDate(),
      $lte: moment(toDate).endOf('day').toDate()
    };
  } else if (fromDate) {
    baseQuery.createdAt = {
      $gte: moment(fromDate).startOf('day').toDate()
    };
  } else if (toDate) {
    baseQuery.createdAt = {
      $lte: moment(toDate).endOf('day').toDate()
    };
  }

  const invoiceQuery = new QueryBuilder(
    Invoice.find(baseQuery).populate("companyId").populate("customer").populate("bank"),
    otherQueryParams
  );

  // Handle search term if provided
  if (searchTerm) {
    const searchTermStr = searchTerm.toString();
    invoiceQuery.modelQuery = invoiceQuery.modelQuery.or([
      { invoiceNumber: { $regex: searchTermStr, $options: 'i' } },
      { invId: { $regex: searchTermStr, $options: 'i' } },
      { details: { $regex: searchTermStr, $options: 'i' } },
      { 'customer.name': { $regex: searchTermStr, $options: 'i' } },
      { 'customer._id': searchTermStr }
    ]);
  }

  // Apply other QueryBuilder methods
  const finalQuery = invoiceQuery
    .filter()
    .sort()
    .paginate()
    .fields();

  // Get results
  const meta = await finalQuery.countTotal();
  const result = await finalQuery.modelQuery;

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
