import mongoose, { Schema } from "mongoose";
import { TInvoice } from "./invoice.interface";

const InvoiceSchema = new Schema<TInvoice>(
  {
    invId:{
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
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

    invDoc:{
      type: String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

// Create the Invoice model
const Invoice = mongoose.model<TInvoice>("Invoice", InvoiceSchema);

export default Invoice;
