import * as Yup from 'yup';

export const yupPricingSchema = Yup.object().shape({
  pricingType: Yup.string().required('Pricing type is required'),

  billingCycleStartDay: Yup.number()
    .nullable()
    .when('pricingType', ([type], schema) =>
      type === 'recurring'
        ? schema.required('Billing cycle start day is required').min(1)
        : schema,
    ),

  price: Yup.number()
    .nullable()
    .when('pricingType', ([type], schema) =>
      type === 'free'
        ? schema.nullable()
        : schema.required('Price is required').min(0),
    ),

  tax: Yup.number()
    .nullable()
    .when('pricingType', ([type], schema) =>
      type === 'free'
        ? schema.nullable()
        : schema.required('Tax is required').min(0),
    ),

  securityDeposit: Yup.number()
    .nullable()
    .when('pricingType', ([type], schema) =>
      type === 'recurring'
        ? schema.required('Security deposit is required').min(0)
        : schema,
    ),

  prorationEnabled: Yup.boolean()
    .when('pricingType', ([type], schema) =>
      type === 'recurring' ? schema.required() : schema,
    )
    .default(false),

  membershipEnabled: Yup.boolean().default(false),

  minimumHourlyBooking: Yup.number()
    .nullable()
    .when('pricingType', ([type], schema) =>
      type === 'hourly'
        ? schema.required('Minimum hourly booking is required').min(0.5)
        : schema,
    ),
});
