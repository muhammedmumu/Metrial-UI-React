import { useContext } from 'react';
import { RouterContext } from '../context/RouterContext.js';

// Hook to use router
export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};