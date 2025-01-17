import mongoose, { Schema, Document } from 'mongoose';
import { TCategory} from './category.interface';


const categorySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["inflow", "outflow"], required: true },
  parentId: { type: String, default: null },
  audit: { type: String, enum: ["Active", "Inactive"], required: true },
  status: { type: String, enum: ["Active", "Inactive"], required: true },
});



// Apply the type at the model level
const Category= mongoose.model<TCategory & Document>('Category', categorySchema);
export default Category;
