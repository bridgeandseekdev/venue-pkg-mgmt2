import mongoose, {Types, Document} from 'mongoose';
import { Brand } from '../types';

export type BrandDocument = Omit<Brand, '_id'> & {
  _id: Types.ObjectId; // Replace _id with ObjectId
} & Document;

const BrandSchema = new mongoose.Schema<BrandDocument>({
  name: { 
    type: String, 
    required: true, 
  }
}, {
  timestamps: true
});

BrandSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model<BrandDocument>('Brand', BrandSchema);