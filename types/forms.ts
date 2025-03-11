import { PricingType } from './models';
import { MediaItem } from './shared';

export type PackageFormStep = 1 | 2 | 3;

// Step 1 form data
export interface PackageBasicFormData {
  name: string;
  description: string;
  quantity: number;
  isInstantlyBookable: boolean;
  media: {
    image: MediaItem;
    video: MediaItem;
  };
}

// Step 2 form data
export interface PackagePricingFormData {
  pricingType: PricingType;
  billingCycleStartDay: number | null;
  price: number | null;
  tax: number | null;
  securityDeposit: number | null;
  prorationEnabled: boolean;
  membershipEnabled: boolean;
  minimumHourlyBooking: number | null;
}

// Form state type
export interface PackageFormState {
  step: PackageFormStep;
  packageId: string | null;
  venueId: string | null;
  basic: PackageBasicFormData;
  pricing: PackagePricingFormData;
}
