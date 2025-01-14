import mongoose, { Schema, Document, CallbackError, Types } from 'mongoose';
import moment from 'moment';
import { TStorage} from './storage.interface';


const storageSchema = new Schema({
  storageName: { type: String, required: true },
  openingBalance: { type: Number, required: true, default: 0 },
  openingDate: { type: Date, required: true },
  logo: { type: String, required: false },
  status: { type: Boolean, required: true, default: true },
  auditStatus: { type: Boolean, required: true, default: true },
});



// Apply the type at the model level
const Storage= mongoose.model<TStorage & Document>('Storage', storageSchema);
export default Storage;
