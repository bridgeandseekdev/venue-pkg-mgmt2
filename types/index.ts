export interface User {
  _id: string;
  email: string;
  role: string;
  venueId: string;
}

export interface Package {
  _id: string;
  venueId: string;
  name: string;
  description: string;
  quantity: number;
  isInstantlyBookable: boolean;
  media: {
    image?: {
      url: string;
      key: string;
    },
    video?: {
      url: string;
      key: string;
    }
  };
  pricing?: PricingDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingDetails {
  type: 'recurring' | 'hourly' | 'onetime' | 'free';
  billingCycleStartDay?: number;
  price?: number;
  tax?: number;
  securityDeposit?: number;
  prorationEnabled?: boolean;
  membershipEnabled?: boolean;
  minimumHourlyBooking?: number;
}