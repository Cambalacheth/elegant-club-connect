
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
      
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
          
        finalAvatarUrl = publicUrl;
      }
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: values.username,
          description: values.description,
          email_visible: values.email_visible,
          website: values.website,
          gender: values.gender,
          birth_date: values.birth_date,
          category: values.categories && values.categories.length > 0 ? values.categories[0] : null,
          categories: values.categories,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
        
      if (updateError) throw updateError;
      
      const { data: existingLinks, error: fetchError } = await supabase
        .from("social_links")
        .select("id, platform")
        .eq("profile_id", userId);
        
      if (fetchError) throw fetchError;
      
      const existingLinksMap = new Map();
      existingLinks?.forEach(link => {
        existingLinksMap.set(link.platform, link.id);
      });
      
      for (const link of socialLinks) {
        if (!link.url) continue;
        
        if (link.id) {
          await supabase
            .from("social_links")
            .update({ platform: link.platform, url: link.url })
            .eq("id", link.id);
            
          existingLinksMap.delete(link.platform);
        } else {
          const existingId = existingLinksMap.get(link.platform);
          
          if (existingId) {
            await supabase
              .from("social_links")
              .update({ url: link.url })
              .eq("id", existingId);
              
            existingLinksMap.delete(link.platform);
          } else {
            await supabase.from("social_links").insert({
              profile_id: userId,
              platform: link.platform,
              url: link.url,
            });
          }
        }
      }
      
      for (const id of existingLinksMap.values()) {
        await supabase.from("social_links").delete().eq("id", id);
      }
      
      toast({
        title: currentLanguage === "en" ? "Success" : "Éxito",
        description: currentLanguage === "en"
          ? "Your changes have been saved"
          : "Tus cambios han sido guardados",
      });
      
      navigate(`/user/${values.username}`);
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: currentLanguage === "en"
          ? "There was an error updating your profile"
          : "Hubo un error al actualizar tu perfil",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isLoading, handleSubmit };
};
