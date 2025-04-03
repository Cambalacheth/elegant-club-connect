
import React, { ReactNode } from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label?: string;
  className?: string;
}

const ActionButton = ({ onClick, icon, label, className = '' }: ActionButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    onClick();
  };

  return (
    <button
      className={`flex items-center justify-center w-8 h-8 rounded-full hover:bg-club-beige/20 transition-colors ${className}`}
      onClick={handleClick}
      title={label}
    >
      {icon}
    </button>
  );
};

export default ActionButton;
