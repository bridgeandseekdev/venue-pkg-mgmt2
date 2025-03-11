import { ID, WithTimestamps, MediaItem } from './shared';

export interface User extends WithTimestamps {
  _id: ID;
  email: string;
  password: string;
  role: 'venue_admin';
  venueId: ID;
  name: string;
}

export interface Brand extends WithTimestamps {
  _id: ID;
  name: string;
}

export interface Venue extends WithTimestamps {
  _id: ID;
  brandId: ID;
  name: string;
}

export type PricingType = 'recurring' | 'hourly' | 'onetime' | 'free' | null;

export interface PricingDetails {
  pricingType: PricingType;
  billingCycleStartDay: number | null;
  price: number | null;
  tax: number | null;
  securityDeposit: number | null;
  prorationEnabled: boolean;
  membershipEnabled: boolean;
  minimumHourlyBooking: number | null;
}

export interface Package extends WithTimestamps {
  _id: ID;
  brandId: ID;
  venueId: ID;
  name: string;
  description: string;
  quantity: number;
  isInstantlyBookable: boolean;
  media: {
    image?: MediaItem;
    video?: MediaItem;
  };
  pricing: PricingDetails;
}
