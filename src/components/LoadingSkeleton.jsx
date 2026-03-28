import React from 'react';

const LoadingSkeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="glass-effect rounded-2xl p-6 space-y-4">
    <LoadingSkeleton className="h-6 w-24" />
    <LoadingSkeleton className="h-8 w-3/4" />
    <LoadingSkeleton className="h-16 w-full" />
    <div className="pt-4 border-t border-white/5 space-y-2">
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-1/3" />
    </div>
  </div>
);

export default LoadingSkeleton;
