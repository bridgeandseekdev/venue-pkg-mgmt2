import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { yupPackageSchema } from '../../lib/yupPackageSchema';
import { usePackageContext } from '../../context/PackageContext';
import { Video as VideoIcon, Image as ImageIcon } from 'lucide-react';

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
  const { reset, setValue } = useForm();

  useEffect(() => {
    reset(state);
  }, [state, reset]);

  const handleFileUpload =
    (mediaType: 'image' | 'video') =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Simulate API call to upload media
      const fakeUrl = URL.createObjectURL(file);
      const fakeKey = `${mediaType}-${Date.now()}`;

      dispatch({
        type: 'UPDATE_MEDIA',
        mediaType,
        value: { url: fakeUrl, key: fakeKey },
      });

      setValue(`media.${mediaType}`, { url: fakeUrl, key: fakeKey });
    };

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
      <div className="flex flex-col space-y-1 mb-8">
        <label htmlFor="name">Package Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'name',
                  value: e.target.value,
                });
              }}
              className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
              placeholder="Enter package name"
            />
          )}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div className="flex flex-col space-y-1 mb-8">
        <label htmlFor="description">Package Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              onChange={(e) => {
                field.onChange(e);
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'description',
                  value: e.target.value,
                });
              }}
              className="border border-gray-300 w-full h-24 rounded-md text-sm px-3 py-2"
              placeholder="Enter package description"
            />
          )}
        />
        {errors.description && <p>{errors.description.message}</p>}
      </div>

      <div className="flex flex-col space-y-1 mb-8">
        <label htmlFor="quantity">Quantity</label>
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              {...field}
              onChange={(e) => {
                field.onChange(e);
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'quantity',
                  value: parseInt(e.target.value),
                });
              }}
              className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
              min={1}
            />
          )}
        />
        {errors.quantity && <p>{errors.quantity.message}</p>}
      </div>

      <div className="mb-8">
        <label htmlFor="instantlyBookable">Instantly Bookable:</label>
        <Controller
          name="isInstantlyBookable"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => {
                field.onChange(e.target.checked);
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'isInstantlyBookable',
                  value: e.target.checked,
                });
              }}
            />
          )}
        />
      </div>

      <div className="space-y-4">
        <label htmlFor="mediaUpload">Media Upload</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload('image')}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-black/50 transition-colors"
            >
              <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm text-gray-500">Upload image</span>
            </label>
          </div>
          <div className="relative">
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileUpload('video')}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-black/50 transition-colors"
            >
              <VideoIcon className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm text-gray-500">Upload Video</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button type="submit">Save</button>
        {state.packageId && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          >
            Next Step
          </button>
        )}
      </div>
    </form>
  );
};

export default Screen1;
