import React from 'react';
import { CircularProgress } from '@mui/material';

const Loading = ({ fullScreen = false, size = 40, message = '' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        <CircularProgress size={size} className="text-purple-600" />
        {message && (
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <CircularProgress size={size} className="text-purple-600" />
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default Loading;