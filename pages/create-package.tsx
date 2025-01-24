import { useSession } from 'next-auth/react';
import { PackageProvider } from '../context/PackageContext';
import PackageForm from '@/components/packageForm/PackageForm';

const CreatePackagePage = () => {
  const { data: session } = useSession();
  const venueId = session?.user?.venueId ?? null;

  return (
    <PackageProvider venueId={venueId}>
      <PackageForm />
    </PackageProvider>
  );
};

export default CreatePackagePage;