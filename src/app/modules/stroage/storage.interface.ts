import { Types } from "mongoose";

export interface TStorage extends Document {
  storageName: string; // Not Null
  openingBalance: number; // Not Null, Default: 0
  openingDate: Date; // Not Null
  logo?: string; // Nullable
  companyId: Types.ObjectId;
}