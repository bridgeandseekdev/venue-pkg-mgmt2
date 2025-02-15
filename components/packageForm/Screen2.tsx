import React, { useEffect } from 'react';
import { usePackageContext } from '../../context/PackageContext';
import { useForm, Controller } from 'react-hook-form';
import { yupPricingSchema } from '@/lib/yupPricingSchema';
import { yupResolver } from '@hookform/resolvers/yup';

const Screen2 = () => {
  const { state, dispatch } = usePackageContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupPricingSchema),
    defaultValues: state.pricing,
  });
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({ defaultValues: state.pricing });
  const { reset } = useForm();
  const packageTypes = [
    { id: 'recurring', label: 'Recurring(Monthly)' },
    { id: 'hourly', label: 'Hourly' },
    { id: 'onetime', label: 'One-time' },
    { id: 'free', label: 'Free' },
  ];

  useEffect(() => {
    reset(state);
  }, [state, reset]);

  const renderPricingFields = () => {
    switch (state.pricing.pricingType) {
      case 'recurring':
        return (
          <>
            <div>
              <label htmlFor="billingCycleStartDay">
                Billing Cycle Start Day
              </label>
              <Controller
                name="billingCycleStartDay"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="billingCycleStartDay"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value =
                        e.target.value === '' ? null : Number(e.target.value);
                      field.onChange(value);
                      dispatch({
                        type: 'UPDATE_PRICING',
                        field: 'billingCycleStartDay',
                        value,
                      });
                    }}
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Day {i + 1}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.billingCycleStartDay && (
                <p>{errors.billingCycleStartDay.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="prorationEnabled">Enable Proration:</label>
              <Controller
                name="prorationEnabled"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      dispatch({
                        type: 'UPDATE_PRICING',
                        field: 'prorationEnabled',
                        value: e.target.checked,
                      });
                    }}
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="securityDeposit">Security Deposit</label>
              <Controller
                name="securityDeposit"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value =
                        e.target.value === '' ? null : Number(e.target.value);
                      field.onChange(value);
                      dispatch({
                        type: 'UPDATE_PRICING',
                        field: 'securityDeposit',
                        value,
                      });
                    }}
                  />
                )}
              />
              {errors.securityDeposit && (
                <p>{errors.securityDeposit.message}</p>
              )}
            </div>
          </>
        );

      case 'hourly':
        return (
          <div>
            <label htmlFor="minimumHourlyBooking">Minimum Hourly Booking</label>
            <Controller
              name="minimumHourlyBooking"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="minimumHourlyBooking"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value =
                      e.target.value === '' ? null : Number(e.target.value);
                    field.onChange(value);
                    dispatch({
                      type: 'UPDATE_PRICING',
                      field: 'minimumHourlyBooking',
                      value,
                    });
                  }}
                >
                  {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} hour{hours > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.minimumHourlyBooking && (
              <p>{errors.minimumHourlyBooking.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmit = async (data) => {
    // Simulate API call to save the package

    try {
      console.log('Saving package:', data);
      // const response = await fetch('/api/packages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();

      // if (response.ok) {
      //   // Update the context with the package ID
      //   dispatch({ type: 'SET_PACKAGE_ID', packageId: result.packageId });
      // } else {
      //   console.error('Failed to save package:', result.message);
      // }
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="packageType">Pricing Type</label>
        <Controller
          name="pricingType"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="packageType"
              onChange={(e) => {
                field.onChange(e.target.value);
                dispatch({
                  type: 'UPDATE_PRICING',
                  field: 'pricingType',
                  value: e.target.value,
                });
              }}
            >
              {packageTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          )}
        />
        {errors.pricingType && <p>{errors.pricingType.message}</p>}
      </div>

      {state.pricing.pricingType !== 'free' && (
        <>
          <div>
            <label htmlFor="price">Price</label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value =
                      e.target.value === '' ? null : Number(e.target.value);
                    field.onChange(value);
                    dispatch({
                      type: 'UPDATE_PRICING',
                      field: 'price',
                      value,
                    });
                  }}
                />
              )}
            />
            {errors.price && <p>{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="tax">Tax (%)</label>
            <Controller
              name="tax"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value =
                      e.target.value === '' ? null : Number(e.target.value);
                    field.onChange(value);
                    dispatch({
                      type: 'UPDATE_PRICING',
                      field: 'tax',
                      value,
                    });
                  }}
                />
              )}
            />
            {errors.tax && <p>{errors.tax.message}</p>}
          </div>
        </>
      )}

      {renderPricingFields()}

      <div className="mb-8">
        <label htmlFor="membershipEnabled">Enable Membership:</label>
        <Controller
          name="membershipEnabled"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => {
                field.onChange(e.target.checked);
                dispatch({
                  type: 'UPDATE_PRICING',
                  field: 'membershipEnabled',
                  value: e.target.checked,
                });
              }}
            />
          )}
        />
        {errors.membershipEnabled && <p>{errors.membershipEnabled.message}</p>}
      </div>

      <div>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default Screen2;
