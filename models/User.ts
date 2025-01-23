import mongoose, {Document, Types} from 'mongoose';
import { User } from '../types';

export type UserDocument = Omit<User, '_id' | 'venueId'> & {
  _id: Types.ObjectId; // Replace _id with ObjectId
  venueId: Types.ObjectId; // Replace venueId with ObjectId
} & Document;

const UserSchema = new mongoose.Schema<UserDocument>({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['venue_admin'] 
  },
  venueId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true, 
  },
  name: {
    type: String
  }
}, {
  timestamps: true
});

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);