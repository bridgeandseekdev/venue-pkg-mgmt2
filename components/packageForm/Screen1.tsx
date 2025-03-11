import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { yupPackageSchema } from '../../lib/yupPackageSchema';
import { usePackageContext } from '../../context/PackageContext';
import { FormInput } from '../form/FormInput';
import { FormTextArea } from '../form/FormTextArea';
import { useFileUpload } from '@/hooks/useFileUpload';
import MediaUploadField from '../form/MediaUploadField';
import { FormSwitch } from '../form/FormSwitch';
import { PackageBasicFormData } from '@/types/forms';

const Screen1 = () => {
  const { state, dispatch } = usePackageContext();
  const {
    control,
    trigger,
    formState: { errors },
  } = useForm<PackageBasicFormData>({
    resolver: yupResolver(yupPackageSchema),
    defaultValues: state.basic,
  });

  const { uploadStatus, handleFileUpload } = useFileUpload({
    onUploadSuccess: (url, key, mediaType) => {
      dispatch({
        type: 'UPDATE_MEDIA',
        mediaType,
        value: { url, key },
      });
    },
    onUploadError: () => {
      // Handle error
    },
    onPreviewGenerated: (url, mediaType) => {
      dispatch({
        type: 'SET_MEDIA_PREVIEW',
        mediaType,
        value: url,
      });
    },
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      dispatch({ type: 'SET_STEP', step: 2 });
    }
  };

  const handleFileChange =
    (mediaType: 'image' | 'video') =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleFileUpload(file, mediaType);
      }
      if (e?.target) {
        e.target.value = '';
      }
    };

  return (
    <form>
      <FormInput
        name="name"
        label="Package Name"
        control={control}
        error={errors.name?.message}
        placeholder="Enter package name"
        onChange={(value) =>
          dispatch({
            type: 'UPDATE_BASIC',
            field: 'name',
            value: value as string,
          })
        }
      />

      <FormTextArea
        name="description"
        label="Package Description"
        control={control}
        error={errors.description?.message}
        placeholder="Enter package description"
        onChange={(value) =>
          dispatch({
            type: 'UPDATE_BASIC',
            field: 'description',
            value,
          })
        }
      />

      <FormInput
        name="quantity"
        label="Quantity"
        type="number"
        control={control}
        error={errors.quantity?.message}
        onChange={(value) =>
          dispatch({
            type: 'UPDATE_BASIC',
            field: 'quantity',
            value: value as number,
          })
        }
      />

      <FormSwitch
        name="isInstantlyBookable"
        label="Instantly Bookable"
        control={control}
        onChange={(checked) =>
          dispatch({
            type: 'UPDATE_BASIC',
            field: 'isInstantlyBookable',
            value: checked,
          })
        }
      />

      {/* Media Upload Section */}
      <div className="space-y-4">
        <label htmlFor="mediaUpload">Media Upload</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MediaUploadField
            type="image"
            previewUrl={state.basic.media.image.previewUrl}
            uploadStatus={uploadStatus.image.status}
            onChange={handleFileChange('image')}
          />
          <MediaUploadField
            type="video"
            previewUrl={state.basic.media.video.previewUrl}
            uploadStatus={uploadStatus.video.status}
            onChange={handleFileChange('video')}
          />
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
