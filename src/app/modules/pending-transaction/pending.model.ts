import mongoose, { Schema } from "mongoose";
import { TPendingTransaction } from "./pending.interface";

const pendingTransactionSchema = new Schema<TPendingTransaction>(
  {
    
  
    
    invoiceDate: {
      type: Date,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    description: {
      type: String
    },
    status: {
      type: String,
      required: true,
      enum: ["due", "paid"],
      default: "due",
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["inflow", "outflow"],
    },
    amount: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create the Invoice model
const PendingTransaction = mongoose.model<TPendingTransaction>("Pending", pendingTransactionSchema);

export default PendingTransaction;
