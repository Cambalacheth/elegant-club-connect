
import React, { ReactNode } from 'react';

interface UserTableCellProps {
  children: ReactNode;
  className?: string;
}

const UserTableCell = ({ children, className = '' }: UserTableCellProps) => {
  return (
    <td className={`px-4 py-3 ${className}`}>
      {children}
    </td>
  );
};

export default UserTableCell;
