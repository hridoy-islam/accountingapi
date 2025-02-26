import QueryBuilder from "../../builder/QueryBuilder";
import { TTransaction } from "../transaction/transaction.interface";
import Transaction from "../transaction/transaction.model";

const getCompanyReportFromDB = async (
  companyId: string,
  query: Record<string, unknown>,
  startDate: string,
  endDate: string
) => {
  // Parse the provided start and end date
  const start = new Date(startDate);
  const end = new Date(endDate);

  const userQuery = new QueryBuilder(
    Transaction.find({ 
      companyId,
      transactionDate: { $gte: start, $lte: end } // Filter by date range
    }).populate("transactionCategory storage transactionMethod"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  // Fetch the transactions
  const transactions: TTransaction[] = await userQuery.modelQuery;

  const meta = await userQuery.countTotal();

  return { meta, result: transactions };
};

export const ReportServices = { getCompanyReportFromDB };
