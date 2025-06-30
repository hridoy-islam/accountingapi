import moment from "moment";
import QueryBuilder from "../../builder/QueryBuilder";
import { TTransaction } from "../transaction/transaction.interface";
import Transaction from "../transaction/transaction.model";

// const getCompanyReportFromDB = async (
//   companyId: string,
//   query: Record<string, unknown>,
//   startDate?: string,
//   endDate?: string
// ) => {
//   const baseFilter: any = { companyId };

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

//   const userQuery = new QueryBuilder(
//     Transaction.find(baseFilter).populate("transactionCategory storage transactionMethod"),
//     query
//   )
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   // Fetch the transactions
//   const transactions: TTransaction[] = await userQuery.modelQuery;

//   const meta = await userQuery.countTotal();

//   return { meta, result: transactions };
// };

const getCompanyReportFromDB = async (
  companyId: string,
  query: Record<string, unknown>,
  startDate?: string,
  endDate?: string
) => {
  const baseFilter: any = { companyId, isDeleted: false };

  // Handle date ranges
  if (startDate && endDate) {
    baseFilter.transactionDate = {
      $gte: moment(startDate).startOf('day').toDate(),
      $lte: moment(endDate).endOf('day').toDate()
    };
  } else if (startDate) {
    baseFilter.transactionDate = {
      $gte: moment(startDate).startOf('day').toDate()
    };
  } else if (endDate) {
    baseFilter.transactionDate = {
      $lte: moment(endDate).endOf('day').toDate()
    };
  }

  // Fetch the transactions directly
  const transactions: TTransaction[] = await Transaction.find(baseFilter)
    .populate("transactionCategory storage transactionMethod");

  return transactions;
};

export const ReportServices = { getCompanyReportFromDB };
