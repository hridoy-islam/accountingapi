import mongoose, { Types } from "mongoose";

export interface InvoiceItem {
  details: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface TInvoice {
  invId: string;
  customer: Types.ObjectId;
  invoiceDate: Date | string;
  invoiceNumber: string;
  description?: string;
  status: "due" | "paid";
  transactionType: "inflow" | "outflow";
  amount: number;
  isDeleted: boolean;
  companyId: Types.ObjectId;
  invDoc?: string;

  notes?: string;
  termsAndConditions?: string;
  items: InvoiceItem[];
}
