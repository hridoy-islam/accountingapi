import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TTransaction } from "./transaction.interface";

const transactionSchema = new Schema(
  {
    tcid: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["inflow", "outflow"],
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    invoiceNumber: {
      type: String,
  
    },
    invoiceDate: {
      type: Date,
      
    },
    details: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
    transactionDoc: {
      type: String,
      default: null,
    },
    transactionCategory: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    transactionMethod: {
      type: Types.ObjectId,
      ref: "Method",
      required: true,
    },
    storage: {
      type: Types.ObjectId,
      ref: "Storage",
      required: true,
    },
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
    isDeleted:{
      type: Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

// Apply the type at the model level
const Transaction = mongoose.model<TTransaction & Document>(
  "Transaction",
  transactionSchema
);
export default Transaction;
