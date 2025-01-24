import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { yupPackageSchema } from "../../lib/yupPackageSchema";
import { usePackageContext } from '../../context/PackageContext';

const Screen1 = () => {
  const { state, dispatch } = usePackageContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupPackageSchema),
    defaultValues: state,
  });

  const onSubmit = async (data) => {
    // Simulate API call to save the package
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        // Update the context with the package ID
        dispatch({ type: 'SET_PACKAGE_ID', packageId: result.packageId });
      } else {
        console.error('Failed to save package:', result.message);
      }
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div>
            <label>Name:</label>
            <input {...field} />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div>
            <label>Description:</label>
            <input {...field} />
            {errors.description && <p>{errors.description.message}</p>}
          </div>
        )}
      />
      <Controller
        name="quantity"
        control={control}
        render={({ field }) => (
          <div>
            <label>Quantity:</label>
            <input type="number" {...field} />
            {errors.quantity && <p>{errors.quantity.message}</p>}
          </div>
        )}
      />
      <Controller
        name="isInstantlyBookable"
        control={control}
        render={({ field }) => (
          <div>
            <label>Instantly Bookable:</label>
            <input
              type="checkbox"
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              value={undefined}
            />
          </div>
        )}
      />
      <button type="submit">Save</button>
      {state.packageId && (
        <button type="button" onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}>
          Next Step
        </button>
      )}
    </form>
  );
};

export default Screen1;