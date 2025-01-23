import mongoose, {Types, Document} from 'mongoose';
import { Venue } from '../types';

export type VenueDocument = Omit<Venue, '_id' | 'brandId'> & {
  _id: Types.ObjectId; // Replace _id with ObjectId
  brandId: Types.ObjectId; // Replace brandId with ObjectId
} & Document;

const VenueSchema = new mongoose.Schema<VenueDocument>({
  name: { 
    type: String, 
    required: true, 
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true, 
  }
}, {
  timestamps: true
});

VenueSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model<VenueDocument>('Venue', VenueSchema);