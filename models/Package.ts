import mongoose, {Types, Document} from 'mongoose';
import { Package, PricingDetails } from '../types';

export type PackageDocument = Omit<Package, '_id' | 'venueId'> & {
  _id: Types.ObjectId; // Replace _id with ObjectId
  venueId: Types.ObjectId; // Replace venueId with ObjectId
} & Document;

const PricingDetailsSchema = new mongoose.Schema<PricingDetails>({
  type: {
    type: String,
    required: false,
    enum: ['monthly', 'hourly', 'onetime', 'free'], 
  },
  billingCycleStartDay: { type: Number, required: false },
  price: { type: Number, required: false },
  tax: { type: Number, required: false },
  securityDeposit: { type: Number, required: false },
  prorationEnabled: { type: Boolean, required: false },
  membershipEnabled: { type: Boolean, required: false },
  minimumHourlyBooking: { type: Number, required: false },
}, { _id: false }); // Disable _id for subdocuments

const PackageSchema = new mongoose.Schema<PackageDocument>({
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true,
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  isInstantlyBookable: { 
    type: Boolean, 
    default: false 
  },
  media: {
    image: {
      url: String,
      key: String
    },
    video: {
      url: String,
      key: String
    }
  },
  pricing: { type: PricingDetailsSchema, required: false },
}, {
  timestamps: true
});

PackageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Package || mongoose.model<PackageDocument>('Package', PackageSchema);