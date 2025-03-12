import mongoose, { Schema } from "mongoose";
import { TInvoice } from "./invoice.interface";

const InvoiceSchema = new Schema<TInvoice>(
  {
    billedFrom: {
      type: String,
      required: true,
    },
    billedFromEmail: {
      type: String,
      required: true,
    },
    billedFromPhone: {
      type: String,
      required: true,
    },
    billedFromAddress: {
      type: String,
      required: true,
    },
    billedTo: {
      type: String,
      required: true,
    },
    billedToEmail: {
      type: String,
      required: true,
    },
    billedToPhone: {
      type: String,
      required: true,
    },
    billedToAddress: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
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
const Invoice = mongoose.model<TInvoice>("Invoice", InvoiceSchema);

export default Invoice;
