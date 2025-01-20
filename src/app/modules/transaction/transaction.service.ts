import AppError from "../../errors/AppError";
import mongoose, { Model } from "mongoose";
import httpStatus from "http-status";
import { TTransaction } from "./transaction.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { transactionSearchableFields } from "./transaction.constant";
import Transaction from "./transaction.model";
import Storage from "../stroage/storage.model";
import Category from "../category/category.model";
import Method from "../transactionMethod/transactionMethod.model";

const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');

const generateUniqueTcid = async (): Promise<string> => {
  const prefix = "TC";
  let uniqueTcid;
  let existingTransaction;

  // Retry logic to generate a unique tcid
  while (true) {
    const randomNumber = Math.floor(Math.random() * 1000000); // Generate a random 6-digit number
    uniqueTcid = `${prefix}${randomNumber.toString().padStart(6, "0")}`;

    existingTransaction = await Transaction.findOne({ tcid: uniqueTcid });
    if (!existingTransaction) {
      break;
    }
  }

  return uniqueTcid;
};

const createTransactionIntoDB = async (payload: TTransaction) => {
  const session = await Transaction.startSession(); // Start a session for the transaction
  session.startTransaction();

  try {
    // Step 1: Generate unique tcid for the transaction
    const tcid = await generateUniqueTcid(); // Generate a unique tcid
    payload.tcid = tcid; // Assign the generated tcid to the payload

    // Step 2: Find the storage model by the provided storage ID in the payload
    const storage = await Storage.findById(payload.storage).session(session);
    if (!storage) {
      throw new AppError(httpStatus.NOT_FOUND, "Storage not found!");
    }

    // Step 3: Check the transactionType and adjust the openingBalance accordingly
    if (payload.transactionType === "inflow") {
      storage.openingBalance += payload.transactionAmount; // Inflow increases the balance
    } else if (payload.transactionType === "outflow") {
      storage.openingBalance -= payload.transactionAmount; // Outflow decreases the balance
    }

    // Step 4: Save the updated storage balance within the transaction
    await storage.save({ session });

    // Step 5: Create and save the transaction within the transaction
    const result = await Transaction.create([payload], { session });

    // Step 6: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result[0]; // Return the created transaction document
  } catch (error: any) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Error in createTransactionIntoDB:", error);
    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create Transaction"
    );
  }
};

const uploadCsvToDB = async (companyId, file) => {
  const filePath = file.path; // Directly use the file path provided by multer
  const results = [];
  let session;

  try {
    // Read and parse the CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    session = await mongoose.startSession();
    session.startTransaction();

    const transactions = [];

    for (const row of results) {
      const [category, method, storage] = await Promise.all([
        Category.findOne({ name: row.transactionCategory }).session(session),
        Method.findOne({ name: row.transactionMethod }).session(session),
        Storage.findOne({ storageName: row.storage, companyId: companyId }).session(session),
      ]);

      if (!category || !method || !storage) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Lookup failed for row: ${JSON.stringify(row)}`
        );
      }

      const payload = {
        transactionType: row.transactionType,
        transactionDate: new Date(row.transactionDate),
        invoiceNumber: row.invoiceNumber,
        invoiceDate: row.invoiceDate ? new Date(row.invoiceDate) : null,
        details: row.details,
        description: row.description,
        transactionAmount: parseFloat(row.transactionAmount),
        transactionCategory: category._id,
        transactionMethod: method._id,
        storage: storage._id,
        companyId: companyId,
      };

      const transaction = await createTransactionIntoDB(payload, session); // Ensure session is passed
      transactions.push(transaction);
    }

    await session.commitTransaction();
    return transactions;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to process CSV data"
    );
  } finally {
    if (session) {
      session.endSession();
    }
    fs.unlinkSync(filePath); // Ensure the file is always deleted
  }
};




// Deletes a transaction Transaction from the database by ID
const deleteTransactionFromDB = async (payload: any) => {
  try {
    // Validate the payload ID
    if (!mongoose.Types.ObjectId.isValid(payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    // Check if the Transaction exists
    const existingTransaction = await Transaction.findById(payload);
    if (!existingTransaction) {
      throw new AppError(httpStatus.NOT_FOUND, "Transaction not found!");
    }

    // Delete the Transaction
    const result = await Transaction.findByIdAndDelete(payload);
    if (!result) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete the Transaction"
      );
    }

    return result;
  } catch (error) {
    console.error("Error in deleteTransactionFromDB:", error);

    // Re-throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete Transaction"
    );
  }
};

// Updates a  Transaction in the database by ID
const updateTransactionInDB = async (
  id: string,
  payload: Partial<TTransaction>
) => {
  const result = await Transaction.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  return result;
};

// Retrieves all  Transactions from the database with support for filtering, sorting, and pagination
const getAllTransactionsFromDB = async (query: Record<string, unknown>) => {
  console.log(query);

  // Initialize the dateFilter as an empty object
  let dateFilter: any = {};

  // Check if startDate and endDate are provided in the query
  if (query.startDate && query.endDate) {
    const startISO = moment(query.startDate).startOf("day").toDate(); // Use .toDate() to get a Date object
    const endISO = moment(query.endDate).endOf("day").toDate(); // Use .toDate() to get a Date object

    // Create the date filter with `transactionDate` field
    dateFilter = {
      transactionDate: {
        $gte: startISO,
        $lte: endISO,
      },
    };
  }

  // Build the query with the optional dateFilter applied
  const userQuery = new QueryBuilder(
    Transaction.find(dateFilter).populate("storage transactionCategory transactionMethod"),
    query
  )
    .search(transactionSearchableFields)
    .filter() // This will handle other filters if any are applied
    .sort()
    .paginate()
    .fields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// Retrieves a single  Transaction from the database by ID
const getOneTransactionFromDB = async (id: string) => {
  const result = await Transaction.findById(id);
  return result;
};

export const TransactionServices = {
  createTransactionIntoDB,
  deleteTransactionFromDB,
  updateTransactionInDB,
  getAllTransactionsFromDB,
  getOneTransactionFromDB,
  uploadCsvToDB
};
