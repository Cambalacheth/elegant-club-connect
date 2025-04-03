
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  uploadProfileAvatar, 
  updateProfileData, 
  updateSocialLinks,
  fetchCurrentProfile 
} from "./utils/profileUpdateService";
import { processProfileChanges } from "./utils/profileXpService";

export const useProfileSubmit = (userId: string, currentLanguage: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (
    values: any,
    avatarUrl: string | null,
    avatarFile: File | null,
    socialLinks: { id?: string; platform: string; url: string }[]
  ) => {
    setIsLoading(true);
    try {
      // Get current profile to check for changes
      const currentProfile = await fetchCurrentProfile(userId);
      
      // Upload avatar if needed
      const finalAvatarUrl = await uploadProfileAvatar(userId, avatarFile, avatarUrl);
      
      // Check for changes that deserve XP and calculate earned points
      const { totalXp, messages } = await processProfileChanges(
        userId,
        values,
        finalAvatarUrl,
        socialLinks,
        currentProfile,
        currentLanguage
      );
      
      // Update profile data
      await updateProfileData(userId, values, finalAvatarUrl);
      
      // Update social links
      await updateSocialLinks(userId, socialLinks);

      // Create success message with XP earned if any
      let toastMessage = currentLanguage === "en" 
        ? "Your profile has been updated successfully" 
        : "Tu perfil ha sido actualizado con éxito";
        
      // Add experience points message if points were awarded
      if (totalXp > 0) {
        toastMessage += currentLanguage === "en"
          ? `. You earned ${messages.join(", ")}!`
          : `. ¡Has ganado ${messages.join(", ")}!`;
      }

      toast({
        title: currentLanguage === "en" ? "Success" : "Éxito",
        description: toastMessage,
      });

      navigate(`/user/${values.username}`);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: currentLanguage === "en" ? "Error" : "Error",
        description: currentLanguage === "en"
          ? "There was an error updating your profile"
          : "Hubo un error al actualizar tu perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit,
  };
};
