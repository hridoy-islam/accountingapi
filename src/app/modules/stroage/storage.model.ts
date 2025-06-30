import mongoose, { Schema, Document, CallbackError, Types } from 'mongoose';
import moment from 'moment';
import { TStorage } from './storage.interface';


const storageSchema = new Schema({
  storageName: { type: String, required: true, unique: true,  },
  openingBalance: { type: Number, required: true, default: 0 },
  currentBalance: { type: Number, required: true, default: 0 },
  openingDate: { type: Date, required: true },
  logo: { type: String, default: null },
  status: { type: Boolean, required: true, default: true },
  auditStatus: { type: Boolean, required: true, default: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});



// Apply the type at the model level
const Storage = mongoose.model<TStorage & Document>('Storage', storageSchema);
export default Storage;
