import mongoose, { Schema } from "mongoose";
import { TInvoice } from "./invoice.interface";

// Define the sub-schema for invoice items
const InvoiceItemSchema = new Schema(
  {
    details: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
   
   

  }
);

const InvoiceSchema = new Schema<TInvoice>(
  {
    invId: {
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
    },
  
    invoiceNumber: {
      type: String,
    },
    bank:{
      type: Schema.Types.ObjectId,
      ref: "Bank",
      required: true
    },

    description: {
      type: String,
      default: "",
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invDoc: {
      type: String,
      default: "",
    },
  
    notes: {
      type: String,
      default: "",
    },
    termsAndConditions: {
      type: String,
      default: "",
    },
  
    items: {
      type: [InvoiceItemSchema],
      required: true,
      default: [],
    },
    tax:{
      type: Number,
      default: 0
    },
    discount:{
      type: Number,
      default: 0
    },
    subtotal:{
      type: Number,
      default: 0
    },
    discountType:{
      type: String,
      enum: ["percentage", "flat"],
      default: "",
    },
    total:{
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model<TInvoice>("Invoice", InvoiceSchema);

export default Invoice;
