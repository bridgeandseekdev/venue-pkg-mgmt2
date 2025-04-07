import React from 'react';
import { usePackageContext } from '../../context/PackageContext';

const Screen3 = () => {
  const { state, dispatch } = usePackageContext();

  const handleDone = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Package Created Successfully!
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Package Details:</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Name:</span> {state.basic.name}
          </p>
          <p>
            <span className="font-medium">Type:</span>{' '}
            {state.pricing.pricingType}
          </p>
          <p>
            <span className="font-medium">Price:</span> ${state.pricing.price}
          </p>
          {/* Add more package details as needed */}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleDone}
          className="rounded-md text-white font-semibold bg-black py-2 px-8"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Screen3;
