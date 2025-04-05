import mongoose, { Schema } from "mongoose";
import { TCSV } from "./csv.interface";

const transactionSchema = new Schema(
  {
    date: { type: String, required: true },
    description: { type: String, required: true },
    paidOut: { type: Number, required: true },
    paidIn: { type: Number, required: true },
  }
);

const csvSchema = new Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    transactions: [transactionSchema],
  }
);

// Create the Invoice model
const CSV = mongoose.model<TCSV>("CSV", csvSchema);

export default CSV;
