
import { useForumUser } from "@/hooks/useForumUser";

// This hook simply re-exports the useForumUser hook for better organization
// and to avoid breaking existing code that imports from useUser
export const useUser = () => {
  return useForumUser();
};
