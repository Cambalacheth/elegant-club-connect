import { supabase } from "@/integrations/supabase/client";

// Upload a profile avatar to Supabase storage
export const uploadProfileAvatar = async (
  userId: string,
  avatarFile: File | null,
  currentAvatarUrl: string | null
): Promise<string | null> => {
  // If no new file, keep current URL
  if (!avatarFile) {
    return currentAvatarUrl;
  }

  try {
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
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

// Update the profile data in Supabase
export const updateProfileData = async (
  userId: string,
  values: any,
  avatarUrl: string | null
): Promise<void> => {
  // Parse birth date or set to null if empty
  const birthDate = values.birth_date?.trim() ? values.birth_date : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      username: values.username,
      description: values.description,
      email_visible: values.email_visible,
      website: values.website,
      gender: values.gender,
      birth_date: birthDate,
      avatar_url: avatarUrl,
      categories: values.categories,
      preferred_language: values.preferred_language,
      speaks_languages: values.speaks_languages,
      learning_languages: values.learning_languages,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
};

// Update social links in Supabase
export const updateSocialLinks = async (
  userId: string,
  socialLinks: { id?: string; platform: string; url: string }[]
): Promise<void> => {
  for (const link of socialLinks) {
    if (link.id) {
      // Update existing link
      const { error } = await supabase
        .from("social_links")
        .update({
          platform: link.platform,
          url: link.url,
        })
        .eq("id", link.id);

      if (error) {
        throw error;
      }
    } else if (link.url && link.url.trim() !== '') {
      // Add new link
      const { error } = await supabase
        .from("social_links")
        .insert({
          profile_id: userId,
          platform: link.platform,
          url: link.url,
        });

      if (error) {
        throw error;
      }
    }
  }
};

// Get the current profile data
export const fetchCurrentProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};
