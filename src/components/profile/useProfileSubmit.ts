
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileSubmit = (userId: string, currentLanguage: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const calculateExperiencePoints = (values: any, avatarUrl: string | null, socialLinks: { id?: string; platform: string; url: string }[]) => {
    let points = 0;
    
    // Profile picture: +50 pts
    if (avatarUrl) {
      points += 50;
    }
    
    // Username: +30 pts (only if it's not default from email)
    const usernameFromEmail = values.email?.split('@')[0];
    if (values.username && values.username !== usernameFromEmail) {
      points += 30;
    }
    
    // Website: +25 pts
    if (values.website && values.website.trim() !== '') {
      points += 25;
    }
    
    // Bio/Description: +25 pts
    if (values.description && values.description.trim() !== '') {
      points += 25;
    }
    
    // Social networks: +5 pts each (max 20 pts)
    const validSocialLinks = socialLinks.filter(link => link.url && link.url.trim() !== '');
    points += Math.min(validSocialLinks.length * 5, 20);
    
    // Languages: +5 pts each
    if (values.speaks_languages && Array.isArray(values.speaks_languages)) {
      points += values.speaks_languages.length * 5;
    }
    
    if (values.learning_languages && Array.isArray(values.learning_languages)) {
      points += values.learning_languages.length * 5;
    }
    
    return points;
  };

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

      // Get current profile to compare and calculate experience points
      const { data: currentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url, username, website, description, experience")
        .eq("id", userId)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      // Calculate experience points to award
      const experiencePoints = calculateExperiencePoints(values, finalAvatarUrl, socialLinks);
      
      // Only award points for new additions
      let pointsToAward = experiencePoints;
      
      // If user already had these fields filled, don't award points again
      if (currentProfile.avatar_url) pointsToAward -= 50;
      if (currentProfile.username && currentProfile.username !== values.email?.split('@')[0]) pointsToAward -= 30;
      if (currentProfile.website) pointsToAward -= 25;
      if (currentProfile.description) pointsToAward -= 25;
      
      // Ensure we don't deduct points if the user didn't previously have these items
      pointsToAward = Math.max(0, pointsToAward);
      
      const newExperience = (currentProfile.experience || 0) + pointsToAward;

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
          experience: newExperience,  // Update the experience points
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
        } else if (link.url && link.url.trim() !== '') {
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

      let toastMessage = currentLanguage === "en" 
        ? "Your profile has been updated successfully" 
        : "Tu perfil ha sido actualizado con éxito";
        
      // Add experience points message if points were awarded
      if (pointsToAward > 0) {
        toastMessage += currentLanguage === "en"
          ? `. You earned +${pointsToAward} XP!`
          : `. ¡Has ganado +${pointsToAward} XP!`;
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
