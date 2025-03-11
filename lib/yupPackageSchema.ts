import * as yup from 'yup';
import { PackageBasicFormData } from '@/types/forms';

export const yupPackageSchema: yup.ObjectSchema<PackageBasicFormData> =
  yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    quantity: yup
      .number()
      .required('Quantity is required')
      .min(1, 'Quantity must be at least 1'),
    isInstantlyBookable: yup.boolean().required(),
    media: yup.object({
      image: yup
        .object({
          url: yup.string().defined().nullable(),
          key: yup.string().defined().nullable(),
          previewUrl: yup.string().defined().nullable(),
        })
        .required(),
      video: yup
        .object({
          url: yup.string().defined().nullable(),
          key: yup.string().defined().nullable(),
          previewUrl: yup.string().defined().nullable(),
        })
        .required(),
    }),
  });
