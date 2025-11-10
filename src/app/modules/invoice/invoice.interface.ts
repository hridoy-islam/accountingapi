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
  dueDate: Date | string;
  invoiceNumber: string;
  bank: Types.ObjectId;
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
  tax?: number;
  discount?: number;
  subtotal: number;
  discountType?: "percentage" | "flat";
  total: number;
}
