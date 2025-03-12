import mongoose from "mongoose";

export interface TInvoice {
  billedFrom: string;
  billedFromEmail: string;
  billedFromPhone: string;
  billedFromAddress: string;
  billedTo: string;
  billedToEmail: string;
  billedToPhone: string;
  billedToAddress: string;
  invoiceDate: Date;
  invoiceNumber: string;
  description: string;
  status: "due" | "paid";
  transactionType: "inflow" | "outflow";
  amount: number;
  details?: string;
  isDeleted: boolean;
  companyId: mongoose.Types.ObjectId;
}
