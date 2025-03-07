
import React from 'react';

interface LoadingStateProps {
  searchingText: string;
}

export const LoadingState = ({ searchingText }: LoadingStateProps) => {
  return (
    <div className="flex justify-center my-8 md:my-12">
      <div className="animate-pulse text-club-brown">{searchingText}</div>
    </div>
  );
};
