import mongoose, { Schema, Document } from "mongoose";
import { TCustomer } from "./customer.interface";

// Define the schema for the TRemit interface
const customerSchema = new Schema<TCustomer>({
  name: { type: String },
  email: { type: String },
  address: { type: String },
  phone: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bankName: { type: String, required: true },
  accountNo: { type: String, required: true },
  sortCode: { type: String, required: true },
  beneficiary: { type: String },
}, {
  timestamps: true
});

const Customer = mongoose.model<TCustomer>("Customer", customerSchema);

export default Customer;
