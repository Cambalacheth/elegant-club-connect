
import { useForumUser } from "@/hooks/useForumUser";
import { UserLevel, UserRole } from "@/types/user";

// This hook simply re-exports the useForumUser hook for better organization
// and to avoid breaking existing code that imports from useUser
export const useUser = () => {
  const { user, userLevel, userExperience, levelInfo, isLoading } = useForumUser();
  
  // Map the new level system to the old role system for backward compatibility
  let userRole: UserRole;
  
  if (userLevel >= 13) {
    userRole = "admin";
  } else if (userLevel >= 8) {
    userRole = "moderator";
  } else if (userLevel >= 2) {
    userRole = "verified";
  } else {
    userRole = "registered";
  }

  return { 
    user, 
    userLevel,
    userExperience,
    levelInfo,
    userRole, 
    isLoading 
  };
};
