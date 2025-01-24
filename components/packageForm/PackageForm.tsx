import React from 'react';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import { usePackageContext } from '../../context/PackageContext';

const PackageForm = () => {
  const { state } = usePackageContext();

  return (
    <div>
      {state.step === 1 && <Screen1 />}
      {state.step === 2 && <Screen2 />}
    </div>
  );
};

export default PackageForm;