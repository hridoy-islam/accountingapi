import mongoose, { Schema, Document } from "mongoose";
import { TBank } from "./bank.interface";

const customerSchema = new Schema<TBank>({
  name: { type: String, required: true },
  sortCode: { type: String, required: true },
  accountNo: { type: String, required: true },
  beneficiary: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
 
},{
  timestamps:true
});

const Bank = mongoose.model<TBank>("Bank", customerSchema);

export default Bank;
