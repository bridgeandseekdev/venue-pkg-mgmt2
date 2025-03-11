import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import {
  PackageFormState,
  PackageFormStep,
  PackageBasicFormData,
  PackagePricingFormData,
} from '@/types/forms';
import { MediaItem } from '@/types/shared';

type PackageAction =
  | { type: 'SET_STEP'; step: PackageFormStep }
  | {
      type: 'UPDATE_BASIC';
      field: keyof PackageBasicFormData;
      value: PackageBasicFormData[keyof PackageBasicFormData];
    }
  | {
      type: 'UPDATE_PRICING';
      field: keyof PackagePricingFormData;
      value: PackagePricingFormData[keyof PackagePricingFormData];
    }
  | { type: 'SET_MEDIA_PREVIEW'; mediaType: 'image' | 'video'; value: string }
  | {
      type: 'UPDATE_MEDIA';
      mediaType: 'image' | 'video';
      value: Partial<MediaItem>;
    }
  | { type: 'SET_PACKAGE_ID'; packageId: string }
  | { type: 'RESET_FORM' };

// Create the context with proper types
const PackageContext = createContext<{
  state: PackageFormState;
  dispatch: React.Dispatch<PackageAction>;
}>({
  state: {} as PackageFormState,
  dispatch: () => null,
});

const initialState: Omit<PackageFormState, 'venueId'> = {
  step: 1,
  packageId: null,
  basic: {
    name: '',
    description: '',
    quantity: 1,
    isInstantlyBookable: false,
    media: {
      image: { url: null, key: null, previewUrl: null },
      video: { url: null, key: null, previewUrl: null },
    },
  },
  pricing: {
    pricingType: null,
    billingCycleStartDay: null,
    price: null,
    tax: null,
    securityDeposit: null,
    prorationEnabled: false,
    membershipEnabled: false,
    minimumHourlyBooking: null,
  },
};

// Update reducer to match new state shape
const packageReducer = (
  state: PackageFormState,
  action: PackageAction,
): PackageFormState => {
  switch (action.type) {
    case 'UPDATE_BASIC':
      return {
        ...state,
        basic: { ...state.basic, [action.field]: action.value },
      };

    case 'SET_MEDIA_PREVIEW':
      return {
        ...state,
        basic: {
          ...state.basic,
          media: {
            ...state.basic.media,
            [action.mediaType]: {
              ...state.basic.media[action.mediaType],
              previewUrl: action.value,
            },
          },
        },
      };

    case 'UPDATE_MEDIA':
      return {
        ...state,
        basic: {
          ...state.basic,
          media: {
            ...state.basic.media,
            [action.mediaType]: {
              ...state.basic.media[action.mediaType],
              ...action.value,
            },
          },
        },
      };

    case 'UPDATE_PRICING':
      return {
        ...state,
        pricing: { ...state.pricing, [action.field]: action.value },
      };

    case 'SET_STEP':
      return { ...state, step: action.step };

    case 'SET_PACKAGE_ID':
      return { ...state, packageId: action.packageId };

    case 'RESET_FORM':
      return { ...initialState, venueId: state.venueId };

    default:
      return state;
  }
};

// Provider component
interface PackageProviderProps {
  children: ReactNode;
  venueId: string | null;
}

export const PackageProvider = ({
  children,
  venueId,
}: PackageProviderProps) => {
  const [state, dispatch] = useReducer(packageReducer, {
    ...initialState,
    venueId,
  });

  return (
    <PackageContext.Provider value={{ state, dispatch }}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackageContext = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackageContext must be used within a PackageProvider');
  }
  return context;
};
