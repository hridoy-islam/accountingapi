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
import moment from "moment";

const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');

const generateUniqueTcid = async (): Promise<string> => {
  const prefix = "TC";
  const now = new Date();

  // Format date as YYYYMMDD
  const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  // Find the latest transaction for today's date
  const latestTransaction = await Transaction.findOne({ tcid: { $regex: `^${prefix}${dateStr}` } })
    .sort({ tcid: -1 }) // Sort in descending order
    .limit(1);

  let increment = 1;
  if (latestTransaction) {
    const lastTcid = latestTransaction.tcid;
    const lastIncrement = parseInt(lastTcid.slice(-4), 10);
    increment = lastIncrement + 1;
  }

  const incrementStr = increment.toString().padStart(4, "0");
  const uniqueTcid = `${prefix}${dateStr}${incrementStr}`;

  return uniqueTcid;
};



export const createTransactionIntoDB = async (payload:any, session?: mongoose.ClientSession) => {
  let localSession: mongoose.ClientSession | null = null;

  try {
    // Start a session only if one isn't already provided
    if (!session) {
      localSession = await Transaction.startSession();
      localSession.startTransaction();
    }

    const activeSession = session || localSession;

    // Step 1: Generate unique tcid for the transaction
    const tcid = await generateUniqueTcid();
    payload.tcid = tcid;

    // Step 2: Find the storage model by the provided storage ID in the payload
    // const storage = await Storage.findById(payload.storage).session(activeSession);
    // if (!storage) {
    //   throw new AppError(httpStatus.NOT_FOUND, 'Storage not found!');
    // }

    // Step 3: Adjust the storage balance based on the transaction type
  //   const update = payload.transactionType === 'inflow'
  //   ? { $inc: { openingBalance: payload.transactionAmount } }
  //   : { $inc: { openingBalance: -payload.transactionAmount } };
  
  // await Storage.findByIdAndUpdate(
  //   payload.storage,
  //   update,
  //   { session: activeSession, new: true }
  // );

    // Step 5: Create and save the transaction document
    const result = await Transaction.create([payload], { session: activeSession });

    // Step 6: Commit the transaction if we started it
    if (localSession) {
      await localSession.commitTransaction();
      localSession.endSession();
    }

    return result[0]; // Return the created transaction
  } catch (error: any) {
    // If an error occurs, abort the transaction if we started it
    if (localSession) {
      await localSession.abortTransaction();
      localSession.endSession();
    }

    console.error('Error in createTransactionIntoDB:', error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to create Transaction'
    );
  }
};


// Retrieves all  Transactions from the database with support for filtering, sorting, and pagination
const getAllTransactionsFromDB = async (query: Record<string, unknown>) => {


  // Initialize the dateFilter as an empty object
  const { startDate, endDate, ...otherQueryParams}=query;

  const dateFilter: Record<string, unknown> = {};
  if (startDate) {
    dateFilter['$gte'] = moment(startDate as string).startOf('day').toDate();
  }
  if (endDate) {
    dateFilter['$lte'] = moment(endDate as string).endOf('day').toDate();
  }

  // Include the date filter only if there's a startDate or endDate
  if (Object.keys(dateFilter).length > 0) {
    otherQueryParams['transactionDate'] =dateFilter;}

 

  // Build the query with the optional dateFilter applied
  const userQuery = new QueryBuilder(
    Transaction.find().populate("storage transactionCategory transactionMethod"),
    otherQueryParams
  )
    .search(transactionSearchableFields)
    .filter(query) // This will handle other filters if any are applied
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


const uploadCsvToDB = async (companyId: any, file: any) => {
  const filePath = file.path; // File path from multer
  const results: any[] = [];
  let session: mongoose.ClientSession | null = null;
  let transactionNumber = 1; // Initialize transaction number tracking
  
  try {
    // Read and parse the CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data: any) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    // Start a session for the transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const transactions: any[] = [];

    // Process each row
    for (const row of results) {

      const [category, method, storage] = await Promise.all([
        Category.findOne({ name: row.transactionCategory }).session(session),
        Method.findOne({ name: row.transactionMethod }).session(session),
        Storage.findOne({ storageName: row.storage, companyId: companyId }).session(session),
      ]);

      // Check if lookups failed
      if (!category) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Category lookup failed for row: ${JSON.stringify(row)}`
        );
      }
      if (!method) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Method lookup failed for row: ${JSON.stringify(row)}`
        );
      }
      if (!storage) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Storage lookup failed for row: ${JSON.stringify(row)}`
        );
      }

      // Prepare transaction payload
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
        transactionNumber: transactionNumber++, // Increment the transaction number
      };

      // Create the transaction in the database and track the transaction
      const transaction = await createTransactionIntoDB(payload, session);
      transactions.push(transaction);
    }

    // Ensure commit only after all transactions are created
    await session.commitTransaction();

    return transactions;
  } catch (error: any) {
    console.error('Transaction failed:', error.message);
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
    fs.unlinkSync(filePath); // Ensure the file is deleted after processing
  }
};





// Deletes a transaction Transaction from the database by ID
const deleteTransactionFromDB = async (payload: any) => {
  try {
    // Validate the payload ID
    if (!mongoose.Types.ObjectId.isValid(payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

   
    const existingTransaction = await Transaction.findById(payload);
    if (!existingTransaction) {
      throw new AppError(httpStatus.NOT_FOUND, "Transaciton not found!");
    }

    
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

const getAllCompanyTransactionsFromDB = async (companyId:string, query: Record<string, unknown>) => {


  // Initialize the dateFilter as an empty object
  const { startDate, endDate, ...otherQueryParams}=query;

  const dateFilter: Record<string, unknown> = {};
  if (startDate) {
    dateFilter['$gte'] = moment(startDate as string).startOf('day').toDate();
  }
  if (endDate) {
    dateFilter['$lte'] = moment(endDate as string).endOf('day').toDate();
  }

  // Include the date filter only if there's a startDate or endDate
  if (Object.keys(dateFilter).length > 0) {
    otherQueryParams['transactionDate'] =dateFilter;}

 

  // Build the query with the optional dateFilter applied
  const userQuery = new QueryBuilder(
    Transaction.find({companyId, isDeleted: false}).populate("storage transactionCategory transactionMethod"),
    otherQueryParams
  )
    .search(transactionSearchableFields)
    .filter(query) // This will handle other filters if any are applied
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



const getYearlyCompanyTransactionsFromDB = async (
  companyId: string,
  query: { year: number }
) => {
  const { year } = query;

  if (!year || isNaN(year)) {
    throw new Error("Invalid or missing year.");
  }

  const startOfYear = moment().year(year).startOf("year").toDate();
  const endOfYear = moment().year(year).endOf("year").toDate();

  const aggregationPipeline = [
  {
    $match: {
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false,
      transactionDate: {
        $gte: startOfYear,
        $lte: endOfYear,
      },
    },
  },
  {
    $project: {
      transactionAmount: 1,
      transactionType: 1,
      month: { $month: "$transactionDate" },
    },
  },
  {
    $group: {
      _id: "$month",
      totalInflow: {
        $sum: {
          $cond: [
            { $eq: ["$transactionType", "inflow"] },
            "$transactionAmount",
            0,
          ],
        },
      },
      totalOutflow: {
        $sum: {
          $cond: [
            { $eq: ["$transactionType", "outflow"] },
            "$transactionAmount",
            0,
          ],
        },
      },
    },
  },
  {
    $sort: { _id: 1 },
  },
];


  const monthlyTotals = await Transaction.aggregate(aggregationPipeline);

  // Fill in months with 0s if missing
  const fullYearData = Array.from({ length: 12 }, (_, i) => {
    const monthData = monthlyTotals.find((m) => m._id === i + 1);
    return {
      month: i + 1,
      totalInflow: monthData?.totalInflow || 0,
      totalOutflow: monthData?.totalOutflow || 0,
    };
  });

  return fullYearData;
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
  getAllCompanyTransactionsFromDB,
  getOneTransactionFromDB,
  uploadCsvToDB,
  getYearlyCompanyTransactionsFromDB
};
