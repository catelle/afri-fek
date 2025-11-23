import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-600"></div>
    <p className="mt-4 text-lg font-semibold text-gray-700">Chargement en cours...</p>
  </div>
);

export default LoadingSpinner;