
import React from 'react';

interface NoResultsProps {
  noResultsText: string;
}

export const NoResults = ({ noResultsText }: NoResultsProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-club-brown">{noResultsText}</p>
    </div>
  );
};
