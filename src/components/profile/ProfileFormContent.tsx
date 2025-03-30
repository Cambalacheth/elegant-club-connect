
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SocialPlatform } from "@/types/profile";
import ProfileFormFields from "./ProfileFormFields";
import ProfileAvatarUpload from "./ProfileAvatarUpload";
import SocialLinksSection from "./SocialLinksSection";
import CategoriesSection from "./CategoriesSection";
import LanguageSection from "./LanguageSection";
import { profileFormSchema } from "./profileFormSchema";

interface ProfileFormContentProps {
  form: UseFormReturn<z.infer<typeof profileFormSchema>>;
  onSubmit: (values: z.infer<typeof profileFormSchema>) => void;
  isLoading: boolean;
  onCancel: () => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  setAvatarFile: (file: File | null) => void;
  socialLinks: { id?: string; platform: string; url: string }[];
  setSocialLinks: (links: { id?: string; platform: string; url: string }[]) => void;
  availablePlatforms: SocialPlatform[];
  setAvailablePlatforms: (platforms: SocialPlatform[]) => void;
  currentLanguage: string;
  texts: Record<string, string>;
  categoriesOptions: { id: string; label: string }[];
  showLanguageSection?: boolean;
}

const ProfileFormContent = ({
  form,
  onSubmit,
  isLoading,
  onCancel,
  avatarUrl,
  setAvatarUrl,
  setAvatarFile,
  socialLinks,
  setSocialLinks,
  availablePlatforms,
  setAvailablePlatforms,
  currentLanguage,
  texts,
  categoriesOptions,
  showLanguageSection = true,
}: ProfileFormContentProps) => {
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

            {showLanguageSection && (
              <LanguageSection
                form={form}
                currentLanguage={currentLanguage}
              />
            )}

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

export default ProfileFormContent;
