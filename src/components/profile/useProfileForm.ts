
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { SocialPlatform } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";

interface UseProfileFormProps {
  userId: string;
  form: UseFormReturn<any>;
}

export const useProfileForm = ({ userId, form }: UseProfileFormProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ id?: string; platform: string; url: string }[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<SocialPlatform[]>([
    "instagram",
    "twitter",
    "github",
    "linkedin",
    "spotify",
    "youtube",
    "tiktok",
    "website",
    "email",
  ]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;

        let categories = profile.categories || [];
        
        if (profile.category && (!categories || categories.length === 0)) {
          categories = [profile.category];
        }

        form.reset({
          username: profile.username,
          description: profile.description || "",
          email_visible: profile.email_visible || false,
          website: profile.website || "",
          gender: profile.gender || "",
          birth_date: profile.birth_date
            ? new Date(profile.birth_date).toISOString().split("T")[0]
            : "",
          categories: categories,
        });

        setAvatarUrl(profile.avatar_url);

        const { data: links, error: linksError } = await supabase
          .from("social_links")
          .select("*")
          .eq("profile_id", userId);

        if (linksError) throw linksError;

        setSocialLinks(links || []);

        if (links && links.length > 0) {
          const usedPlatforms = links.map((link) => link.platform as SocialPlatform);
          setAvailablePlatforms((prev) =>
            prev.filter((platform) => !usedPlatforms.includes(platform))
          );
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [userId, form]);

  return {
    avatarUrl,
    setAvatarUrl,
    avatarFile,
    setAvatarFile,
    socialLinks,
    setSocialLinks,
    availablePlatforms,
    setAvailablePlatforms
  };
};
