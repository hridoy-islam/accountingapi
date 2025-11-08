import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import config from "../../config";


const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find().populate('createdBy'), query)
    .search(UserSearchableFields)
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

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  if (payload.password) {
    // Hash the password before updating if it's provided
    payload.password = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  return result;
};

const getAllCompanyUserFromDB = async (companyId:string, query: Record<string, unknown>) => {

  const userQuery = new QueryBuilder(User.find({companyId}).populate('createdBy companyId'), query)
    .search(UserSearchableFields)
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

export const UserServices = {
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  getAllCompanyUserFromDB
};
