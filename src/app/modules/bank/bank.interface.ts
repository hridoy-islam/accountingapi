import { Types } from "mongoose";

export interface TBank {
  name: string,
  sortCode: string,
  accountNo: string,
  beneficiary: string
  companyId: Types.ObjectId,
}