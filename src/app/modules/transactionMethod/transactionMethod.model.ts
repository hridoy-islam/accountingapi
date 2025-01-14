import mongoose, { Schema, Document, CallbackError, Types } from 'mongoose';
import moment from 'moment';
import { TMethod } from './transactionMethod.interface';


const transactionMethodSchema = new Schema({
  name: { type: String, required: true }, // Stored as ISO string
  
});



// Apply the type at the model level
const Method = mongoose.model<TMethod & Document>('Method', transactionMethodSchema);
export default Method;
