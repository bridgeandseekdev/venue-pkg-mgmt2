import React from 'react';
import { usePackageContext } from '../../context/PackageContext';

const Screen2 = () => {
  const { dispatch } = usePackageContext();

  return (
    <div>
      <h2>Pricing Details</h2>
      <button type="button" onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}>
        Back
      </button>
    </div>
  );
};

export default Screen2;