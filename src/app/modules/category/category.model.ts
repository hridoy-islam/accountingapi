import mongoose, { Schema, Document, CallbackError, Types } from 'mongoose';
import { TCategory} from './category.interface';


const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: true
  },
  categoryType: {
    type: String,
    required: true,
    enum: ['inflow', 'outflow']
  },
  parentCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }

});



// Apply the type at the model level
const Category= mongoose.model<TCategory & Document>('Category', categorySchema);
export default Category;
