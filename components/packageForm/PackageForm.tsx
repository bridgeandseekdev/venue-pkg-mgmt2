import React from 'react';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import { usePackageContext } from '../../context/PackageContext';

const PackageForm = () => {
  const { state } = usePackageContext();

  return (
    <div className="container max-w-3xl mx-auto py-6 px-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Create new package
        </h1>
        <p className="text-center">
          {state.step === 1
            ? 'Enter the basic details of your package'
            : 'Configure pricing and membership options'}
        </p>
      </div>
      <div className="py-6 px-4 md:p-8 rounded-md shadow-lg bg-gray-50">
        {state.step === 1 && <Screen1 />}
        {state.step === 2 && <Screen2 />}
      </div>
    </div>
  );
};

export default PackageForm;
