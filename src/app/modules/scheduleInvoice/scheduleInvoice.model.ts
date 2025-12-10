import mongoose, { Schema } from "mongoose";
import { TScheduleInvoice } from "./scheduleInvoice.interface";

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

const ScheduleInvoiceSchema = new Schema<TScheduleInvoice>(
  {
    invId: {
      type: String,
      
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
    },
    
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoiceDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    invoiceNumber: {
      type: String,
    },
    bank: {
      type: Schema.Types.ObjectId,
      ref: "Bank",

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
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    subtotal: {
      type: Number,
      default: 0
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "",
    },
    total: {
      type: Number,
      default: 0
    },
    partialPayment: {
      type: Number,
      default: 0
    },
    partialPaymentType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "flat",
    },
    balanceDue: {
      type: Number,
      default: 0
    },
    topNote: {
      type: String,
      default: "",
    },
    isRecurring:{
      type: Boolean,
      default: false,
    },
    
    frequency: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],

    },
    frequencyDueDate:{
      type: Number,
    },
    scheduledMonth:{
      type: Number,
    },
    scheduledDay:{
      type: Number,
    },
    
    lastRunDate: {
      type: Date
    }

  },
  {
    timestamps: true,
  }
);

const ScheduleInvoice = mongoose.model<TScheduleInvoice>("ScheduleInvoice", ScheduleInvoiceSchema);

export default ScheduleInvoice;
