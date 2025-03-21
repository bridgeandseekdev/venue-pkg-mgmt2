import React, { useEffect } from 'react';
import { usePackageContext } from '../../context/PackageContext';
import { useForm } from 'react-hook-form';
import { yupPricingSchema } from '@/lib/yupPricingSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormInput } from '../form/FormInput';
import { FormSwitch } from '../form/FormSwitch';
import { FormSelect } from '../form/FormSelect';
import { PackagePricingFormData } from '@/types/forms';
import { Package } from '@/types/models';

const packageTypes = [
  { id: 'free', label: 'Free' },
  { id: 'recurring', label: 'Recurring' },
  { id: 'hourly', label: 'Hourly' },
] as const;

const Screen2 = () => {
  const { state, dispatch } = usePackageContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackagePricingFormData>({
    resolver: yupResolver(yupPricingSchema),
    defaultValues: state.pricing,
  });

  useEffect(() => {
    reset(state.pricing);
  }, [state.pricing, reset]);

  const onSubmit = async (pricingData: PackagePricingFormData) => {
    try {
      const mediaForApi = {
        image:
          state.basic.media.image &&
          state.basic.media.image.url &&
          state.basic.media.image.key
            ? {
                url: state.basic.media.image.url,
                key: state.basic.media.image.key,
                previewUrl: state.basic.media.image.previewUrl || null,
              }
            : undefined,
        video:
          state.basic.media.video &&
          state.basic.media.video.url &&
          state.basic.media.video.key
            ? {
                url: state.basic.media.video.url,
                key: state.basic.media.video.key,
                previewUrl: state.basic.media.video.previewUrl || null,
              }
            : undefined,
      };

      const packageData: Omit<
        Package,
        '_id' | 'brandId' | 'createdAt' | 'updatedAt'
      > = {
        venueId: state.venueId!,
        name: state.basic.name,
        description: state.basic.description,
        quantity: state.basic.quantity,
        isInstantlyBookable: state.basic.isInstantlyBookable,
        media: mediaForApi,
        pricing: pricingData,
      };

      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData),
      });
      const result = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_PACKAGE_ID', packageId: result.packageId });
        dispatch({ type: 'SET_STEP', step: 3 });
      } else {
        alert(`Failed to save package: ${result.message}`);
      }
    } catch (error) {
      alert('Error saving package. Please try again.');
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
            value: value as 'free' | 'recurring' | 'hourly',
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
