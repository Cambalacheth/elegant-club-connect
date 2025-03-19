
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SocialPlatform } from "@/types/profile";
import ProfileFormFields from "./ProfileFormFields";
import ProfileAvatarUpload from "./ProfileAvatarUpload";
import SocialLinksSection from "./SocialLinksSection";
import CategoriesSection from "./CategoriesSection";
import { useProfileSubmit } from "./useProfileSubmit";
import { getProfileFormTexts } from "./profileFormTexts";
import { profileFormSchema } from "./profileFormSchema";

interface SocialLink {
  id?: string;
  platform: string;
  url: string;
}

interface EditProfileFormProps {
  userId: string;
  currentLanguage: string;
  onCancel: () => void;
}

const EditProfileForm = ({ userId, currentLanguage, onCancel }: EditProfileFormProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
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
  
  const { isLoading, handleSubmit: submitProfile } = useProfileSubmit(userId, currentLanguage);
  const texts = getProfileFormTexts(currentLanguage);

  const categoriesOptions = [
    { id: "Legal", label: currentLanguage === "en" ? "Legal" : "Legal" },
    { id: "Tecnología", label: currentLanguage === "en" ? "Technology" : "Tecnología" },
    { id: "Finanzas", label: currentLanguage === "en" ? "Finance" : "Finanzas" },
    { id: "Audiovisual", label: currentLanguage === "en" ? "Audiovisual" : "Audiovisual" },
    { id: "Comunidad", label: currentLanguage === "en" ? "Community" : "Comunidad" },
    { id: "Salud", label: currentLanguage === "en" ? "Health" : "Salud" },
  ];

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      description: "",
      email_visible: false,
      website: "",
      gender: "",
      birth_date: "",
      categories: [],
    },
  });

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

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    await submitProfile(values, avatarUrl, avatarFile, socialLinks);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-club-olive/20 p-8">
        <h1 className="text-3xl font-semibold text-club-brown text-center md:text-left">
          {texts.title}
        </h1>
      </div>

      <div className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ProfileAvatarUpload 
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              setAvatarFile={setAvatarFile}
              currentLanguage={currentLanguage}
            />

            <ProfileFormFields 
              form={form} 
              texts={texts}
            />

            <CategoriesSection 
              form={form} 
              currentLanguage={currentLanguage} 
              categoriesOptions={categoriesOptions} 
            />

            <SocialLinksSection 
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinks}
              availablePlatforms={availablePlatforms}
              setAvailablePlatforms={setAvailablePlatforms}
              currentLanguage={currentLanguage}
            />

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {texts.cancelButton}
              </Button>
              <Button
                type="submit"
                className="bg-club-orange hover:bg-club-terracotta text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentLanguage === "en" ? "Saving..." : "Guardando..."}
                  </>
                ) : (
                  texts.saveButton
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProfileForm;
