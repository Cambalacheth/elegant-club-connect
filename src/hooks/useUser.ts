
import { useForumUser } from "@/hooks/useForumUser";
import { UserLevel, UserRole, levelToRole } from "@/types/user";

// This hook simply re-exports the useForumUser hook for better organization
// and to avoid breaking existing code that imports from useUser
export const useUser = () => {
  const { user, userLevel, userExperience, levelInfo, isLoading } = useForumUser();
  
  // Map the new level system to the old role system for backward compatibility
  const userRole = user ? levelToRole(userLevel) : "registered";
  
  console.log("useUser hook:", { user, userLevel, userRole });

  return { 
    user, 
    userLevel,
    userExperience,
    levelInfo,
    userRole, 
    isLoading 
  };
};
