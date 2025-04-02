
import { UserLevel } from "@/types/user";

interface UserLevelIconProps {
  userLevel: UserLevel;
}

const UserLevelIcon = ({ userLevel }: UserLevelIconProps) => {
  if (!userLevel || userLevel < 2) return null;
  
  // Different icon colors based on level ranges
  let colorClass = "text-gray-500"; // Default for lower levels
  
  if (userLevel >= 13) {
    colorClass = "text-red-500"; // Admin
  } else if (userLevel >= 10) {
    colorClass = "text-purple-500"; // Higher levels
  } else if (userLevel >= 8) {
    colorClass = "text-blue-500"; // Moderator levels
  } else if (userLevel >= 5) {
    colorClass = "text-green-500"; // Mid levels
  } else if (userLevel >= 2) {
    colorClass = "text-yellow-500"; // Beginning levels
  }
  
  return (
    <div className={`font-bold text-xs ${colorClass} bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center`}>
      {userLevel}
    </div>
  );
};

export default UserLevelIcon;
