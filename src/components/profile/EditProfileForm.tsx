
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfileSubmit } from "./useProfileSubmit";
import { getProfileFormTexts } from "./profileFormTexts";
import { profileFormSchema } from "./profileFormSchema";
import { useProfileForm } from "./useProfileForm";
import ProfileFormContent from "./ProfileFormContent";
import { getCategoryOptions } from "./utils/categoryOptions";

interface EditProfileFormProps {
  userId: string;
  currentLanguage: string;
  onCancel: () => void;
}

const EditProfileForm = ({ userId, currentLanguage, onCancel }: EditProfileFormProps) => {
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
  
  const { isLoading, handleSubmit: submitProfile } = useProfileSubmit(userId, currentLanguage);
  const texts = getProfileFormTexts(currentLanguage);
  
  const {
    avatarUrl,
    setAvatarUrl,
    avatarFile,
    setAvatarFile,
    socialLinks,
    setSocialLinks,
    availablePlatforms,
    setAvailablePlatforms
  } = useProfileForm({ userId, form });

  const categoriesOptions = getCategoryOptions(currentLanguage);

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    await submitProfile(values, avatarUrl, avatarFile, socialLinks);
  };

  return (
    <ProfileFormContent
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      avatarUrl={avatarUrl}
      setAvatarUrl={setAvatarUrl}
      setAvatarFile={setAvatarFile}
      socialLinks={socialLinks}
      setSocialLinks={setSocialLinks}
      availablePlatforms={availablePlatforms}
      setAvailablePlatforms={setAvailablePlatforms}
      currentLanguage={currentLanguage}
      texts={texts}
      categoriesOptions={categoriesOptions}
      showLanguageSection={false}
    />
  );
};

export default EditProfileForm;
