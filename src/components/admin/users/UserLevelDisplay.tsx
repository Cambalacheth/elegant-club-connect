
import React from 'react';
import { UserLevel, getLevelName } from "@/types/user";

interface UserLevelDisplayProps {
  level: UserLevel;
}

const UserLevelDisplay = ({ level }: UserLevelDisplayProps) => {
  return (
    <div className="flex items-center">
      <span className="bg-club-orange/20 text-club-orange text-xs font-medium px-2 py-1 rounded-full mr-1">
        {level || 1}
      </span>
      <span className="text-sm text-gray-700">
        {getLevelName(level)}
      </span>
    </div>
  );
};

export default UserLevelDisplay;
