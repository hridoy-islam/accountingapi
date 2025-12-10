import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import { ScheduleInvoiceSearchableFields } from "./scheduleInvoice.constant";
import { TScheduleInvoice } from "./scheduleInvoice.interface";
import ScheduleInvoice from "./scheduleInvoice.model";
import moment from "moment";


const generateUniqueInvId = async (companyId: string): Promise<string> => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  const prefix = dateStr;
  let nextNumber = 1;
  let invId = "";
  let unique = false;

  while (!unique) {
    const paddedNumber = String(nextNumber).padStart(3, "0");
    invId = `${prefix}${paddedNumber}`;

    // Check if this invId already exists for this company
    const exists = await ScheduleInvoice.findOne({
      invId,
      companyId, // Ensure it's company-specific
    }).lean();

    if (!exists) {
      unique = true;
    } else {
      nextNumber++;
    }
  }

  return invId;
};

// Creates a new ScheduleInvoice in the database
const createScheduleInvoiceIntoDB = async (payload: TScheduleInvoice) => {
  try {
    const uniqueInvId = await generateUniqueInvId((payload as any)?.companyId);
    const result = await ScheduleInvoice.create({ ...payload});
    return result;
  } catch (error: any) {
    console.error("Error in createScheduleInvoiceIntoDB:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create ScheduleInvoice"
    );
  }
};

// Deletes an ScheduleInvoice from the database by ID
const deleteScheduleInvoiceFromDB = async (id: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    const existingScheduleInvoice = await ScheduleInvoice.findById(id);
    if (!existingScheduleInvoice) {
      throw new AppError(httpStatus.NOT_FOUND, "ScheduleInvoice not found!");
    }

    // Soft delete (optional)
    const result = await ScheduleInvoice.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!result) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete the ScheduleInvoice"
      );
    }

    return result;
  } catch (error) {
    console.error("Error in deleteScheduleInvoiceFromDB:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete ScheduleInvoice"
    );
  }
};

// Updates an ScheduleInvoice in the database by ID
const updateScheduleInvoiceInDB = async (id: string, payload: Partial<TScheduleInvoice>) => {
  const result = await ScheduleInvoice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "ScheduleInvoice not found!");
  }

  return result;
};

const getAllScheduleInvoicesFromDB = async (query: Record<string, unknown>) => {
  const ScheduleInvoiceQuery = new QueryBuilder(ScheduleInvoice.find(), query)
    .search(ScheduleInvoiceSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await ScheduleInvoiceQuery.countTotal();
  const result = await ScheduleInvoiceQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getAllCompanyScheduleInvoicesFromDB = async (
  companyId: string,
  query: Record<string, unknown>
) => {
  const { fromDate, toDate, searchTerm, ...otherQueryParams } = query;

  const baseQuery: any = {
    companyId,
    isDeleted: false,
  };

  if (fromDate && toDate) {
    baseQuery.createdAt = {
      $gte: moment(fromDate).startOf("day").toDate(),
      $lte: moment(toDate).endOf("day").toDate(),
    };
  } else if (fromDate) {
    baseQuery.createdAt = {
      $gte: moment(fromDate).startOf("day").toDate(),
    };
  } else if (toDate) {
    baseQuery.createdAt = {
      $lte: moment(toDate).endOf("day").toDate(),
    };
  }

  const ScheduleInvoiceQuery = new QueryBuilder(
    ScheduleInvoice.find(baseQuery)
      .populate("companyId")
      .populate("customer")
      .populate("bank"),
    otherQueryParams
  );

  // Handle search term if provided
  if (searchTerm) {
    const searchTermStr = searchTerm.toString();
    ScheduleInvoiceQuery.modelQuery = ScheduleInvoiceQuery.modelQuery.or([
      { invoiceNumber: { $regex: searchTermStr, $options: "i" } },
      { invId: { $regex: searchTermStr, $options: "i" } },
      { details: { $regex: searchTermStr, $options: "i" } },
      { "customer.name": { $regex: searchTermStr, $options: "i" } },
      { "customer._id": searchTermStr },
    ]);
  }

  // Apply other QueryBuilder methods
  const finalQuery = ScheduleInvoiceQuery.filter(query).sort().paginate().fields();

  // Get results
  const meta = await finalQuery.countTotal();
  const result = await finalQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// Retrieves a single ScheduleInvoice from the database by ID
const getOneScheduleInvoiceFromDB = async (id: string) => {
  const result = await ScheduleInvoice.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "ScheduleInvoice not found!");
  }
  return result;
};

export const ScheduleInvoiceServices = {
  createScheduleInvoiceIntoDB,
  deleteScheduleInvoiceFromDB,
  updateScheduleInvoiceInDB,
  getAllScheduleInvoicesFromDB,
  getOneScheduleInvoiceFromDB,
  getAllCompanyScheduleInvoicesFromDB,
};
