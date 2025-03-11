import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';

export const RootErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>;
};
