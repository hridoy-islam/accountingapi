import { Types } from "mongoose";

export interface TCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  companyId: Types.ObjectId;
  bankName: string;
  accountNo: string;
  sortCode: string;
  beneficiary: string;
   address2?: string;
  city?: string;
  state?: string;
  postCode?: string;
  country?: string;
}
