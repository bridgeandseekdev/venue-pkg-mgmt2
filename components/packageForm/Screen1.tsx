import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { nanoid } from 'nanoid';

import { yupPackageSchema } from '../../lib/yupPackageSchema';
import { usePackageContext } from '../../context/PackageContext';
import { Video as VideoIcon, Image as ImageIcon } from 'lucide-react';
import { UploadStatus } from '@/types';
import { Switch } from '../ui/Switch';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const MULTIPART_THRESHOLD = 5 * 1024 * 1024; // 5MB
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4'];

const Screen1 = () => {
  const { state, dispatch } = usePackageContext();
  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupPackageSchema),
    defaultValues: state,
  });
  const { reset, setValue } = useForm();

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    type: null,
    status: null,
  });

  useEffect(() => {
    reset(state);
  }, [state, reset]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      dispatch({ type: 'SET_STEP', step: 2 });
    }
  };

  const validateFile = (file: File, type: 'image' | 'video') => {
    console.log('validating file', file);
    const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    const acceptedTypes =
      type === 'image' ? ACCEPTED_IMAGE_TYPES : ACCEPTED_VIDEO_TYPES;

    if (!acceptedTypes.includes(file.type)) {
      alert(
        `Invalid ${type} type. Only ${acceptedTypes.join(', ')} are allowed.`,
      );
      return false;
    }
    if (file.size > maxSize) {
      alert(`File size exceeds the limit of ${maxSize / 1024 / 1024}MB.`);
      return false;
    }
    return true;
  };

  const handleFileUpload =
    (mediaType: 'image' | 'video') =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      console.log('In file upload', file);

      try {
        if (!validateFile(file, mediaType)) return;
        setUploadStatus({ type: mediaType, status: 'uploading' });

        const isLargeVideo =
          file.type.startsWith('video/') && file.size > MULTIPART_THRESHOLD;
        console.log('isLargeVideo', isLargeVideo);

        if (isLargeVideo) {
          const chunks = Math.ceil(file.size / CHUNK_SIZE);
          const key = `${mediaType}/${nanoid()}.${file.type.split('/')[1]}`;

          //Initiate multipart upload
          const initiateResponse = await fetch('/api/multipart/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key,
              contentType: file.type,
            }),
          });
          const { uploadId } = await initiateResponse.json();

          // Prepare all chunks for parallel upload
          const uploadPromises = Array.from(
            { length: chunks },
            async (_, i) => {
              const start = i * CHUNK_SIZE;
              const end = Math.min(start + CHUNK_SIZE, file.size);
              const chunk = file.slice(start, end);

              // Get upload URL for this part
              const urlResponse = await fetch('/api/multipart/getUploadUrl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  key,
                  uploadId,
                  partNumber: i + 1,
                }),
              });
              const { uploadUrl } = await urlResponse.json();

              // Upload the chunk
              const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: chunk,
              });

              if (!uploadResponse.ok) {
                throw new Error(`Failed to upload part ${i + 1}`);
              }

              const ETag = uploadResponse.headers.get('ETag');
              return {
                PartNumber: i + 1,
                ETag: ETag?.replace(/"/g, ''),
              };
            },
          );

          // Upload all parts in parallel
          const uploadedParts = await Promise.all(uploadPromises);

          //Complete multipart upload
          const response = await fetch('/api/multipart/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key,
              uploadId,
              parts: uploadedParts,
            }),
          });

          console.log('----', response);
        } else {
          //Regular upload for other files
          console.log('Regular upload starting');
          const response = await fetch('/api/upload-urls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contentType: file.type,
              fileType: mediaType,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to get upload URL');
          }

          const { uploadUrl, key, finalUrl } = await response.json();

          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload file');
          }

          setValue(`media.${mediaType}`, { url: finalUrl, key });
          dispatch({
            type: 'UPDATE_MEDIA',
            mediaType,
            value: { url: finalUrl, key },
          });
          setUploadStatus({ type: mediaType, status: 'success' });
          console.log(uploadStatus);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(error instanceof Error ? error.message : 'Failed to upload file');

        setValue(`media.${mediaType}`, { url: null, key: null });
        dispatch({
          type: 'UPDATE_MEDIA',
          mediaType,
          value: { url: null, key: null },
        });
        setUploadStatus({ type: mediaType, status: 'error' });
      } finally {
        if (e?.target) {
          e.target.value = '';
        }
      }
    };

  return (
    <form>
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

      <div className="flex justify-between align-middle mb-8">
        <label htmlFor="instantlyBookable">Instantly Bookable</label>
        <Controller
          name="isInstantlyBookable"
          control={control}
          render={({ field }) => (
            <Switch
              id="isInstantlyBookable"
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'isInstantlyBookable',
                  value: checked,
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
        <button
          type="button"
          onClick={handleNext}
          className="rounded-md text-white font-medium bg-black py-2 px-8"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default Screen1;
