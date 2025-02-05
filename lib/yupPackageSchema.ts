import * as Yup from 'yup';

export const yupPackageSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  isInstantlyBookable: Yup.boolean(),
  media: Yup.object().shape({
    image: Yup.object().shape({
      url: Yup.string().url('Invalid URL').nullable(),
      key: Yup.string().nullable(),
    }).nullable(),
    video: Yup.object().shape({
      url: Yup.string().url('Invalid URL').nullable(),
      key: Yup.string().nullable(),
    }).nullable(),
  }),
});