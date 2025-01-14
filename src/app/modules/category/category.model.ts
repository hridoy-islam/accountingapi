import mongoose, { Schema, Document, CallbackError, Types } from 'mongoose';
import { TTransaction} from './category.interface';


const transactionSchema = new Schema({
  tcid: {
    type: String,
    required: true,
    unique: true,
    match: /^TC\d{6}$/,
    default: function () {
      return 'TC' + Math.floor(100000 + Math.random() * 900000);
    }
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['inflow', 'outflow']
  },
  transactionDate: {
    type: Date,
    required: true
  },
  invoiceNumber: {
    type: String,
    default: null
  },
  invoiceDate: {
    type: Date,
    default: null
  },
  details: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  transactionAmount: {
    type: Number,
    required: true
  },
  transactionDoc: {
    type: String,
    default: null
  },
  transactionCategory: {
    type: Types.ObjectId,
    ref: 'Category',
    required: true
  },
  transactionMethod: {
    type: Types.ObjectId,
    ref: 'TransactionMethod',
    required: true
  },
  storage: {
    type: Types.ObjectId,
    ref: 'Storage',
    required: true
  }
});



// Apply the type at the model level
const Transaction= mongoose.model<TTransaction & Document>('Transactions', transactionSchema);
export default Transaction;
