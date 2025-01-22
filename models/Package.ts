import mongoose from 'mongoose';
import { Package } from '../types';

const PackageSchema = new mongoose.Schema<Package>({
  venueId: { 
    type: String, 
    required: true 
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
  }
}, {
  timestamps: true
});

export default mongoose.models.Package || mongoose.model<Package>('Package', PackageSchema);