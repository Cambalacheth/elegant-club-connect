
import React, { ReactNode } from 'react';

interface UserTableRowProps {
  children: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

const UserTableRow = ({ children, isSelected = false, onClick }: UserTableRowProps) => {
  return (
    <tr 
      className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? "bg-club-beige/20" : ""}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export default UserTableRow;
