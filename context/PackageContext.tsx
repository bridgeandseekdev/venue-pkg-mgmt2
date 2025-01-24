import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Define the initial state
interface PackageState {
  step: number;
  packageId: string | null;
  venueId: string | null;
  name: string;
  description: string;
  quantity: number;
  isInstantlyBookable: boolean;
  media: {
    image: { url: string; key: string };
    video: { url: string; key: string };
  };
  pricing: {
    type: string;
    billingCycleStartDay: number | null;
    price: number | null;
    tax: number | null;
    securityDeposit: number | null;
    prorationEnabled: boolean;
    membershipEnabled: boolean;
    minimumHourlyBooking: number | null;
  };
}

const initialState: PackageState = {
  step: 1,
  packageId: null,
  venueId: null,
  name: '',
  description: '',
  quantity: 0,
  isInstantlyBookable: false,
  media: {
    image: { url: '', key: '' },
    video: { url: '', key: '' },
  },
  pricing: {
    type: '',
    billingCycleStartDay: null,
    price: null,
    tax: null,
    securityDeposit: null,
    prorationEnabled: false,
    membershipEnabled: false,
    minimumHourlyBooking: null,
  },
};

type PackageAction =
  | { type: 'UPDATE_FIELD'; field: keyof PackageState; value: string | number | boolean }
  | { type: 'UPDATE_MEDIA'; mediaType: keyof PackageState['media']; value: { url: string; key: string } }
  | { type: 'UPDATE_PRICING'; field: keyof PackageState['pricing']; value: string | number | boolean | null }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_PACKAGE_ID'; packageId: string }
  | { type: 'RESET' };
  
// Create the context
const PackageContext = createContext<{
  state: PackageState;
  dispatch: React.Dispatch<PackageAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const packageReducer = (state: PackageState, action: PackageAction): PackageState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_MEDIA':
      return { ...state, media: { ...state.media, [action.mediaType]: action.value } };
    case 'UPDATE_PRICING':
      return { ...state, pricing: { ...state.pricing, [action.field]: action.value } };
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_PACKAGE_ID':
      return { ...state, packageId: action.packageId };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Provider component
interface PackageProviderProps {
  children: ReactNode;
  venueId: string | null;
}

export const PackageProvider = ({ children, venueId }: PackageProviderProps) => {
  const [state, dispatch] = useReducer(packageReducer, { ...initialState, venueId });

  return (
    <PackageContext.Provider value={{ state, dispatch }}>
      {children}
    </PackageContext.Provider>
  );
};

// Custom hook to use the context
export const usePackageContext = () => useContext(PackageContext);