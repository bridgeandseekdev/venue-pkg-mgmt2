import mongoose from 'mongoose';
import { User } from '../types';

const UserSchema = new mongoose.Schema<User>({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['venue_admin'] 
  },
  venueId: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);