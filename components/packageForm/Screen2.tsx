import React, { useEffect } from 'react';
import { usePackageContext } from '../../context/PackageContext';
import { useForm, Controller } from 'react-hook-form';
import { yupPricingSchema } from '@/lib/yupPricingSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Switch } from '../ui/Switch';

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

  const onSubmit = async () => {
    // Simulate API call to save the package
    try {
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

  const renderPricingFields = () => {
    switch (state.pricing.pricingType) {
      case 'recurring':
        return (
          <>
            <div className="flex flex-col space-y-1 mb-8">
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
                    className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
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
            <div className="flex justify-between align-middle mb-8">
              <label htmlFor="prorationEnabled">Enable Proration:</label>
              <Controller
                name="prorationEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="prorationEnabled"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      dispatch({
                        type: 'UPDATE_PRICING',
                        field: 'prorationEnabled',
                        value: checked,
                      });
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-col space-y-1 mb-8">
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
                    className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
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
          <div className="flex flex-col space-y-1 mb-8">
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
                  className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-1 mb-8">
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
              className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
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
          <div className="flex flex-col space-y-1 mb-8">
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
                  className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
                />
              )}
            />
            {errors.price && <p>{errors.price.message}</p>}
          </div>

          <div className="flex flex-col space-y-1 mb-8">
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
                  className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
                />
              )}
            />
            {errors.tax && <p>{errors.tax.message}</p>}
          </div>
        </>
      )}

      {renderPricingFields()}

      <div className="flex justify-between align-middle mb-8">
        <label htmlFor="membershipEnabled">Enable Membership</label>
        <Controller
          name="membershipEnabled"
          control={control}
          render={({ field }) => (
            <Switch
              id="membershipEnabled"
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                dispatch({
                  type: 'UPDATE_PRICING',
                  field: 'membershipEnabled',
                  value: checked,
                });
              }}
            />
          )}
        />
        {errors.membershipEnabled && <p>{errors.membershipEnabled.message}</p>}
      </div>

      <div className="flex justify-between mt-12">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
          className="rounded-md font-medium border text-sm border-gray-500 py-2 px-6"
        >
          Previous Step
        </button>
        <button
          type="submit"
          className="rounded-md text-white font-semibold bg-black py-1 px-6"
        >
          Save Package
        </button>
      </div>
    </form>
  );
};

export default Screen2;
