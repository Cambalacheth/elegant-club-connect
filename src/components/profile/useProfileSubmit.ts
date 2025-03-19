
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface SocialLink {
  id?: string;
  platform: string;
  url: string;
}

export const useProfileSubmit = (userId: string, currentLanguage: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (
    values: z.infer<any>,
    avatarUrl: string | null,
    avatarFile: File | null,
    socialLinks: SocialLink[]
  ) => {
    setIsLoading(true);
    
    try {
      let finalAvatarUrl = avatarUrl;
      
      // Upload new avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);
          
        if (uploadError) {
          console.error("Avatar upload error:", uploadError);
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
          
        finalAvatarUrl = publicUrl;
      }
      
      // Prepare the profile update data
      const profileData = {
        username: values.username,
        description: values.description,
        email_visible: values.email_visible,
        website: values.website,
        gender: values.gender,
        // Only include birth_date if it's not empty
        ...(values.birth_date ? { birth_date: values.birth_date } : { birth_date: null }),
        category: values.categories && values.categories.length > 0 ? values.categories[0] : null,
        categories: values.categories || [],
        avatar_url: finalAvatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId);
        
      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }
      
      // Handle social links
      const { data: existingLinks, error: fetchError } = await supabase
        .from("social_links")
        .select("id, platform")
        .eq("profile_id", userId);
        
      if (fetchError) {
        console.error("Error fetching existing social links:", fetchError);
        throw fetchError;
      }
      
      const existingLinksMap = new Map();
      existingLinks?.forEach(link => {
        existingLinksMap.set(link.platform, link.id);
      });
      
      // Update or insert social links
      for (const link of socialLinks) {
        if (!link.url) continue;
        
        if (link.id) {
          const { error: updateLinkError } = await supabase
            .from("social_links")
            .update({ platform: link.platform, url: link.url })
            .eq("id", link.id);
            
          if (updateLinkError) {
            console.error("Error updating social link:", updateLinkError);
          }
            
          existingLinksMap.delete(link.platform);
        } else {
          const existingId = existingLinksMap.get(link.platform);
          
          if (existingId) {
            const { error: updateLinkError } = await supabase
              .from("social_links")
              .update({ url: link.url })
              .eq("id", existingId);
              
            if (updateLinkError) {
              console.error("Error updating existing social link:", updateLinkError);
            }
              
            existingLinksMap.delete(link.platform);
          } else {
            const { error: insertLinkError } = await supabase
              .from("social_links")
              .insert({
                profile_id: userId,
                platform: link.platform,
                url: link.url,
              });
              
            if (insertLinkError) {
              console.error("Error inserting social link:", insertLinkError);
            }
          }
        }
      }
      
      // Remove deleted social links
      for (const id of existingLinksMap.values()) {
        const { error: deleteLinkError } = await supabase
          .from("social_links")
          .delete()
          .eq("id", id);
          
        if (deleteLinkError) {
          console.error("Error deleting social link:", deleteLinkError);
        }
      }
      
      toast({
        title: currentLanguage === "en" ? "Success" : "Éxito",
        description: currentLanguage === "en"
          ? "Your changes have been saved"
          : "Tus cambios han sido guardados",
      });
      
      navigate(`/user/${values.username}`);
      
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Provide more specific error messages
      let errorMessage = error.message || "Unknown error";
      
      if (error.code === "22007") {
        errorMessage = currentLanguage === "en"
          ? "Invalid date format"
          : "Formato de fecha inválido";
      }
      
      toast({
        title: "Error",
        description: currentLanguage === "en"
          ? `There was an error updating your profile: ${errorMessage}`
          : `Hubo un error al actualizar tu perfil: ${errorMessage}`,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isLoading, handleSubmit };
};
