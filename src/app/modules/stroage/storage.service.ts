import AppError from "../../errors/AppError";
import mongoose, { Model } from "mongoose";
import httpStatus from "http-status";
import { TStorage } from "./storage.interface";
import Storage from "./storage.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { storageSearchableFields } from "./storage.constant";
import Transaction from "../transaction/transaction.model";

// Creates a new transaction Storage in the database after validating for duplicates
const createStorageIntoDB = async (payload: TStorage) => {
  try {
    // Check if the Storage name already exists
    
    // Create and save the Storage
    const result = await Storage.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createStorageIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Storage");
  }
};

// Deletes a transaction Storage from the database by ID 
const deleteStorageFromDB = async (payload: any) => {
  try {
    // Validate the payload ID
    if (!mongoose.Types.ObjectId.isValid(payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID format");
    }

    // Check if the Storage exists
    const existingStorage = await Storage.findById(payload);
    if (!existingStorage) {
      throw new AppError(httpStatus.NOT_FOUND, "Storage not found!");
    }

    // Delete the Storage
    const result = await Storage.findByIdAndDelete(payload);
    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the Storage");
    }

    return result;
  } catch (error) {
    console.error("Error in deleteStorageFromDB:", error);

    // Re-throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,  "Failed to delete Storage");
  }
};

// Updates a transaction Storage in the database by ID 
const updateStorageInDB = async (id: string, payload: Partial<TStorage>) => {
  const result = await Storage.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  return result;
};

// Retrieves all transaction Storages from the database with support for filtering, sorting, and pagination
const getAllStoragesFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Storage.find().populate('companyId'), query)
    .search(storageSearchableFields)
    .filter(query)
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

// const getAllCompanyStoragesFromDB = async (
//   companyId: string,
//   query: Record<string, unknown>
// ) => {
//   // Validate companyId
//   if (!mongoose.Types.ObjectId.isValid(companyId)) {
//     throw new Error('Invalid company ID');
//   }

//   const companyObjectId = new mongoose.Types.ObjectId(companyId);

//   // Create query for storages
//   const userQuery = new QueryBuilder(
//     Storage.find({ companyId: companyObjectId })
//       .populate({
//         path: 'companyId',
//         select: 'name' 
//       }),
//     query
//   )
//     .search(storageSearchableFields)
//     .filter(query)
//     .sort()
//     .paginate()
//     .fields();

//   const meta = await userQuery.countTotal();
//   const storages = await userQuery.modelQuery;

//   // If no storages found, return early
//   if (storages.length === 0) {
//     return {
//       meta,
//       result: []
//     };
//   }

//   const storageIds = storages.map(storage => storage._id);

//   // Fetch all transactions for these storages
//   const transactions = await Transaction.aggregate([
//     {
//       $match: {
//         storage: { $in: storageIds },
//         companyId: companyObjectId,
//         isDeleted: false
//       }
//     },
//     {
//       $group: {
//         _id: '$storage',
//         inflow: {
//           $sum: {
//             $cond: [{ $eq: ['$transactionType', 'inflow'] }, '$transactionAmount', 0]
//           }
//         },
//         outflow: {
//           $sum: {
//             $cond: [{ $eq: ['$transactionType', 'outflow'] }, '$transactionAmount', 0]
//           }
//         }
//       }
//     }
//   ]);

//   // Convert aggregation result to a map for easy lookup
//   const balanceMap = new Map();
//   transactions.forEach(tx => {
//     balanceMap.set(tx._id.toString(), {
//       inflow: tx.inflow,
//       outflow: tx.outflow
//     });
//   });

//   // Prepare result and update storage balances
//   const result = await Promise.all(
//     storages.map(async (storage) => {
//       const storageId = storage._id.toString();
//       const balances = balanceMap.get(storageId) || { inflow: 0, outflow: 0 };
//       const openingBalance = storage.openingBalance || 0;
//       const currentBalance = openingBalance + balances.inflow - balances.outflow;

//       // Update storage's current balance if it's different
//       if (storage.currentBalance !== currentBalance) {
//         await Storage.findByIdAndUpdate(
//           storage._id,
//           { CurrentBalance: currentBalance },
//           { new: true }
//         );
//       }

//       return {
//         ...storage.toObject(),
//         currentBalance,
//         inflow: balances.inflow,
//         outflow: balances.outflow,
//         openingBalance,
//         companyId: storage.companyId 
//       };
//     })
//   );

//   return {
//     meta,
//     result
//   };
// };

// Retrieves a single transaction Storage from the database by ID



const getCompanyAllStoragesFromDB = async (companyId: string) => {
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new Error('Invalid company ID');
  }

  const companyObjectId = new mongoose.Types.ObjectId(companyId);

  // 1. Fetch Storages (Lightweight)
  const storages = await Storage.find({ companyId: companyObjectId }).lean();
  if (!storages.length) return { result: [] };

  // 🚀 OPTIMIZATION 1: Prepare Hybrid IDs for Index-based Matching
  // We create a list containing BOTH the ObjectId and String versions of every storage ID.
  // This allows the database to find records instantly regardless of how they were saved.
  const targetStorageIds = storages.flatMap(s => [
    s._id,                    // As ObjectId
    s._id.toString()          // As String
  ]);

  const pipeline = [
    {
      // 🚀 OPTIMIZATION 2: Strict Filtering
      // By filtering 'storage' here using $in, we drastically reduce the data volume
      // before doing any calculations.
      $match: {
        companyId: companyObjectId,
        storage: { $in: targetStorageIds }, 
        $or: [
          { isDeleted: false },
          { isDeleted: null },
          { isDeleted: { $exists: false } }
        ]
      }
    },
    {
      $group: {
        // 🚀 OPTIMIZATION 3: Merge Mixed Types
        // Grouping by $toString ensures that ObjectId('123') and "123" 
        // end up in the exact same bucket.
        _id: { $toString: '$storage' },
        inflow: {
          $sum: {
            $cond: [
              { $eq: [{ $toLower: '$transactionType' }, 'inflow'] },
              { $toDouble: '$transactionAmount' }, // Safe convert for math
              0
            ]
          }
        },
        outflow: {
          $sum: {
            $cond: [
              { $eq: [{ $toLower: '$transactionType' }, 'outflow'] },
              { $toDouble: '$transactionAmount' }, // Safe convert for math
              0
            ]
          }
        }
      }
    }
  ];

  const balances = await Transaction.aggregate(pipeline);

  // 3. Create Map for O(1) lookup
  const balanceMap = new Map();
  balances.forEach(b => {
    balanceMap.set(b._id, b);
  });

  // 4. Calculate Final Results
  const result = storages.map(storage => {
    const sId = storage._id.toString();
    const data = balanceMap.get(sId) || { inflow: 0, outflow: 0 };
    const openingBalance = storage.openingBalance || 0;

    return {
      ...storage,
      openingBalance,
      inflow: data.inflow,
      outflow: data.outflow,
      currentBalance: openingBalance + data.inflow - data.outflow
    };
  });

  return { result };
};


const getOneStorageFromDB = async (id: string) => {
  const result = await Storage.findById(id);
  return result;
};

export const StorageServices = {
  createStorageIntoDB,
  deleteStorageFromDB,
  updateStorageInDB,
  getAllStoragesFromDB,
  getOneStorageFromDB,
  getCompanyAllStoragesFromDB
};
