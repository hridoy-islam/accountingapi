import mongoose, { Types } from "mongoose";

export interface TInvoice {
  invId:string;
  customer: Types.ObjectId;
  invoiceDate: Date;
  invoiceNumber: string;
  description: string;
  status: "due" | "paid";
  transactionType: "inflow" | "outflow";
  amount: number;
  details?: string;
  isDeleted: boolean;
  companyId: Types.ObjectId;
  invDoc?:string
}
