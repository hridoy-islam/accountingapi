import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TCompany } from "./company.interface";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignUser: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    logo: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Apply the type at the model level
const Company = mongoose.model<TCompany & Document>("Company", companySchema);
export default Company;
