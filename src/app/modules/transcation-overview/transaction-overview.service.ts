import AppError from "../../errors/AppError";
import mongoose, { Model } from "mongoose";
import httpStatus from "http-status";
import { TStorage } from "./transaction-overview.interface";
import Storage from "./transaction-overview.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { storageSearchableFields } from "./transaction-overview.constant";


const getAllCompanyStoragesFromDB = async (companyId:string,query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Storage.find({companyId}).populate('companyId'), query)
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



export const StorageServices = {
  
  getAllCompanyStoragesFromDB
};
