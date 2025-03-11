import * as Yup from 'yup';
import { PackagePricingFormData } from '@/types/forms';
import { PricingType } from '@/types/models';

export const yupPricingSchema: Yup.ObjectSchema<PackagePricingFormData> =
  Yup.object({
    pricingType: Yup.string()
      .oneOf(['recurring', 'hourly', 'free'], 'Invalid pricing type')
      .required('Pricing type is required') as Yup.StringSchema<PricingType>,

    billingCycleStartDay: Yup.number()
      .nullable()
      .when('pricingType', {
        is: 'recurring',
        then: (schema) =>
          schema.required('Billing cycle start day is required').min(1),
        otherwise: (schema) => schema.nullable(),
      }),

    price: Yup.number()
      .nullable()
      .when('pricingType', {
        is: 'free',
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required('Price is required').min(0),
      }),

    tax: Yup.number()
      .nullable()
      .when('pricingType', {
        is: 'free',
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required('Tax is required').min(0),
      }),

    securityDeposit: Yup.number()
      .nullable()
      .when('pricingType', {
        is: 'recurring',
        then: (schema) =>
          schema.required('Security deposit is required').min(0),
        otherwise: (schema) => schema.nullable(),
      }),

    prorationEnabled: Yup.boolean()
      .when('pricingType', {
        is: 'recurring',
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.default(false),
      })
      .default(false),

    membershipEnabled: Yup.boolean().default(false),

    minimumHourlyBooking: Yup.number()
      .nullable()
      .when('pricingType', {
        is: 'hourly',
        then: (schema) =>
          schema.required('Minimum hourly booking is required').min(0.5),
        otherwise: (schema) => schema.nullable(),
      }),
  }) as Yup.ObjectSchema<PackagePricingFormData>;
