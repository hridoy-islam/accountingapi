import moment from "moment";
import QueryBuilder from "../../builder/QueryBuilder";
import { TTransaction } from "../transaction/transaction.interface";
import Transaction from "../transaction/transaction.model";
import mongoose from "mongoose";

// const getCompanyReportFromDB = async (
//   companyId: string,
//   query: Record<string, unknown>,
//   startDate?: string,
//   endDate?: string
// ) => {
//   const baseFilter: any = { companyId, isDeleted: false };

//   // Handle date ranges
//   if (startDate && endDate) {
//     baseFilter.transactionDate = {
//       $gte: moment(startDate).startOf('day').toDate(),
//       $lte: moment(endDate).endOf('day').toDate()
//     };
//   } else if (startDate) {
//     baseFilter.transactionDate = {
//       $gte: moment(startDate).startOf('day').toDate()
//     };
//   } else if (endDate) {
//     baseFilter.transactionDate = {
//       $lte: moment(endDate).endOf('day').toDate()
//     };
//   }

//   // Fetch the transactions directly
//   const transactions: TTransaction[] = await Transaction.find(baseFilter)
//     .populate("transactionCategory storage transactionMethod");

//   return transactions;
// };



const getCompanyReportFromDB = async (
  companyId: string,
  query: Record<string, unknown> = {},
  startDate?: string,
  endDate?: string
) => {
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new Error('Invalid company ID');
  }

  const companyObjectId = new mongoose.Types.ObjectId(companyId);

  const matchConditions: any = {
    companyId: companyObjectId,
    isDeleted: { $ne: true },
  };

  // Date filtering
  if (startDate || endDate) {
    matchConditions.transactionDate = {};
    if (startDate) {
      matchConditions.transactionDate.$gte = moment(startDate).startOf('day').toDate();
    }
    if (endDate) {
      matchConditions.transactionDate.$lte = moment(endDate).endOf('day').toDate();
    }
  }

  // Apply safe query filters
  const allowedQueryFields = ['transactionCategory', 'storage', 'transactionMethod', 'transactionType'];
  for (const key of allowedQueryFields) {
    if (key in query && query[key] != null) {
      const val = query[key];
      if (Array.isArray(val) && val.length > 0) {
        matchConditions[key] = { $in: val.map(id => new mongoose.Types.ObjectId(id)) };
      } else if (typeof val === 'string' && mongoose.Types.ObjectId.isValid(val)) {
        matchConditions[key] = new mongoose.Types.ObjectId(val);
      }
    }
  }

  // Build pipeline WITHOUT $facet and WITH all needed fields
  const pipeline = [
    { $match: matchConditions },

    // ✅ PROJECT ALL REQUIRED FIELDS (do NOT omit any you need!)
    {
      $project: {
        // Core transaction fields you listed
        tcid: 1,
        transactionType: 1,
        transactionDate: 1,
        invoiceNumber: 1,
        invoiceDate: 1,
        details: 1,
        description: 1,
        transactionAmount: 1, // ← not 'amount'

        // Foreign keys for lookup
        storage: 1,
        transactionMethod: 1,
        transactionCategory: 1,

        // You may also want _id, companyId, etc.
        _id: 1,
        companyId: 1,
      }
    },

    // Lookup storage → only storageName
    {
      $lookup: {
        from: 'storages',
        localField: 'storage',
        foreignField: '_id',
        as: 'storage',
        pipeline: [{ $project: { storageName: 1 } }]
      }
    },
    { $unwind: { path: '$storage', preserveNullAndEmptyArrays: true } },

    // Lookup method → only name
    {
      $lookup: {
        from: 'methods',
        localField: 'transactionMethod',
        foreignField: '_id',
        as: 'transactionMethod',
        pipeline: [{ $project: { name: 1 } }]
      }
    },
    { $unwind: { path: '$transactionMethod', preserveNullAndEmptyArrays: true } },

    // Lookup category → only name
    {
      $lookup: {
        from: 'categories',
        localField: 'transactionCategory',
        foreignField: '_id',
        as: 'transactionCategory',
        pipeline: [{ $project: { name: 1 } }]
      }
    },
    { $unwind: { path: '$transactionCategory', preserveNullAndEmptyArrays: true } },
  ];

  // ⚠️ This still loads ALL results into memory!
  // Only safe if result set is < ~50k docs
  const transactions = await Transaction.aggregate(pipeline)
    .allowDiskUse(true)
    .exec();

  return transactions;
};


export const ReportServices = { getCompanyReportFromDB };
