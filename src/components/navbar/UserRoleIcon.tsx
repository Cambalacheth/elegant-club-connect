
import { UserLevel } from "@/types/user";

interface UserLevelIconProps {
  userLevel: UserLevel;
}

interface UserRoleIconProps {
  userRole?: string;
  userLevel?: UserLevel;
}

// Component now accepts either userRole or userLevel
const UserRoleIcon = ({ userRole, userLevel }: UserRoleIconProps) => {
  // If userLevel is passed directly, use it
  let level = userLevel;
  
  // If only userRole is passed, convert it to an equivalent userLevel
  if (!level && userRole) {
    if (userRole === "admin") {
      level = 13;
    } else if (userRole === "moderator") {
      level = 8;
    } else if (userRole === "verified") {
      level = 2;
    } else {
      level = 1;
    }
  }
  
  // If no valid level, don't render anything
  if (!level || level < 2) return null;
  
  // Different icon colors based on level ranges
  let colorClass = "text-gray-500"; // Default for lower levels
  
  if (level >= 13) {
    colorClass = "text-red-500"; // Admin
  } else if (level >= 10) {
    colorClass = "text-purple-500"; // Higher levels
  } else if (level >= 8) {
    colorClass = "text-blue-500"; // Moderator levels
  } else if (level >= 5) {
    colorClass = "text-green-500"; // Mid levels
  } else if (level >= 2) {
    colorClass = "text-yellow-500"; // Beginning levels
  }
  
  return (
    <div className={`font-bold text-xs ${colorClass} bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center`}>
      {level}
    </div>
  );
};

export default UserRoleIcon;

// For backward compatibility
export const UserLevelIcon = UserRoleIcon;
