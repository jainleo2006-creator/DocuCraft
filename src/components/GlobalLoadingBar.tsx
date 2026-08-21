import React, { useEffect, useState } from 'react';
import { loadingManager } from '../services/loadingManager';

export const GlobalLoadingBar: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return loadingManager.subscribe((loading) => {
      setIsLoading(loading);
    });
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600 animate-pulse w-full shadow-md" />
    </div>
  );
};
