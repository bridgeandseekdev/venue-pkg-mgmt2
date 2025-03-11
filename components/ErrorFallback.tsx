import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! Something went wrong
        </h2>
        {error && (
          <p className="text-gray-600 mb-4 px-4">
            {error.message || 'An unexpected error occurred'}
          </p>
        )}
        <div className="space-x-4">
          <button
            onClick={resetErrorBoundary}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};
