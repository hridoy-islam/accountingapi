import mongoose, { Schema, Document, CallbackError, Types } from 'mongoose';
import moment from 'moment';
import { TStorage } from './transaction-overview.interface';


const storageSchema = new Schema({
  year: 
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});



// Apply the type at the model level
const Storage = mongoose.model<TStorage & Document>('Storage', storageSchema);
export default Storage;
