import React, { useEffect } from 'react';
import { usePackageContext } from '../../context/PackageContext';
import { useForm } from 'react-hook-form';
import { yupPricingSchema } from '@/lib/yupPricingSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormInput } from '../form/FormInput';
import { FormSwitch } from '../form/FormSwitch';
import { FormSelect } from '../form/FormSelect';

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
            <FormSelect
              name="billingCycleStartDay"
              label="Billing Cycle Start Day"
              control={control}
              options={Array.from({ length: 31 }, (_, i) => ({
                value: i + 1,
                label: `Day ${i + 1}`,
              }))}
              error={errors.billingCycleStartDay?.message}
              onChange={(value) =>
                dispatch({
                  type: 'UPDATE_PRICING',
                  field: 'billingCycleStartDay',
                  value: Number(value),
                })
              }
            />

            <FormSwitch
              name="prorationEnabled"
              label="Enable Proration"
              control={control}
              onChange={(checked) =>
                dispatch({
                  type: 'UPDATE_PRICING',
                  field: 'prorationEnabled',
                  value: checked,
                })
              }
            />

            <FormInput
              name="securityDeposit"
              label="Security Deposit"
              type="number"
              control={control}
              error={errors.securityDeposit?.message}
              onChange={(value) =>
                dispatch({
                  type: 'UPDATE_PRICING',
                  field: 'securityDeposit',
                  value: value as number,
                })
              }
            />
          </>
        );

      case 'hourly':
        return (
          <FormSelect
            name="minimumHourlyBooking"
            label="Minimum Hourly Booking"
            control={control}
            options={[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((hours) => ({
              value: hours,
              label: `${hours} hour${hours > 1 ? 's' : ''}`,
            }))}
            error={errors.minimumHourlyBooking?.message}
            onChange={(value) =>
              dispatch({
                type: 'UPDATE_PRICING',
                field: 'minimumHourlyBooking',
                value: Number(value),
              })
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSelect
        name="pricingType"
        label="Pricing Type"
        control={control}
        options={packageTypes.map((type) => ({
          value: type.id,
          label: type.label,
        }))}
        error={errors.pricingType?.message}
        onChange={(value) =>
          dispatch({
            type: 'UPDATE_PRICING',
            field: 'pricingType',
            value,
          })
        }
      />

      {state.pricing.pricingType !== 'free' && (
        <>
          <FormInput
            name="price"
            label="Price"
            type="number"
            control={control}
            error={errors.price?.message}
            onChange={(value) =>
              dispatch({
                type: 'UPDATE_PRICING',
                field: 'price',
                value: value as number,
              })
            }
          />

          <FormInput
            name="tax"
            label="Tax (%)"
            type="number"
            control={control}
            error={errors.tax?.message}
            onChange={(value) =>
              dispatch({
                type: 'UPDATE_PRICING',
                field: 'tax',
                value: value as number,
              })
            }
          />
        </>
      )}

      {renderPricingFields()}

      <FormSwitch
        name="membershipEnabled"
        label="Enable Membership"
        control={control}
        onChange={(checked) =>
          dispatch({
            type: 'UPDATE_PRICING',
            field: 'membershipEnabled',
            value: checked,
          })
        }
      />

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
