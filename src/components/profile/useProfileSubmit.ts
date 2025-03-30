
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // If a new avatar is selected, upload it
      let finalAvatarUrl = avatarUrl;

      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        finalAvatarUrl = data.publicUrl;
      }

      // Parse birth date or set to null if empty
      const birthDate = values.birth_date?.trim()
        ? values.birth_date
        : null;

      // Update profile data
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: values.username,
          description: values.description,
          email_visible: values.email_visible,
          website: values.website,
          gender: values.gender,
          birth_date: birthDate,
          avatar_url: finalAvatarUrl,
          categories: values.categories,
          preferred_language: values.preferred_language,
          speaks_languages: values.speaks_languages,
          learning_languages: values.learning_languages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      // Handle social links
      for (const link of socialLinks) {
        if (link.id) {
          // Update existing link
          const { error: linkUpdateError } = await supabase
            .from("social_links")
            .update({
              platform: link.platform,
              url: link.url,
            })
            .eq("id", link.id);

          if (linkUpdateError) {
            throw linkUpdateError;
          }
        } else {
          // Add new link
          const { error: linkInsertError } = await supabase
            .from("social_links")
            .insert({
              profile_id: userId,
              platform: link.platform,
              url: link.url,
            });

          if (linkInsertError) {
            throw linkInsertError;
          }
        }
      }

      toast({
        title: currentLanguage === "en" ? "Success" : "Éxito",
        description: currentLanguage === "en"
          ? "Your profile has been updated successfully"
          : "Tu perfil ha sido actualizado con éxito",
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
