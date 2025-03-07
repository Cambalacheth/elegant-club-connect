
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialPlatform } from "@/types/profile";
import ProfileAvatarUpload from "./profile/ProfileAvatarUpload";
import SocialLinksSection from "./profile/SocialLinksSection";
import CategoriesSection from "./profile/CategoriesSection";
import { useProfileSubmit } from "./profile/useProfileSubmit";
import { getProfileFormTexts } from "./profile/profileFormTexts";

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

  const formSchema = z.object({
    username: z.string().min(3, {
      message:
        currentLanguage === "en"
          ? "Username must be at least 3 characters."
          : "El nombre de usuario debe tener al menos 3 caracteres.",
    }),
    description: z.string().optional(),
    email_visible: z.boolean().default(false),
    website: z.string().optional(),
    gender: z.string().optional(),
    birth_date: z.string().optional(),
    categories: z.array(z.string()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.usernameLabel}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.websiteLabel}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://your-website.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.genderLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={texts.genderLabel} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">{texts.genderMale}</SelectItem>
                        <SelectItem value="female">{texts.genderFemale}</SelectItem>
                        <SelectItem value="other">{texts.genderOther}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.birthDateLabel}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CategoriesSection 
              form={form} 
              currentLanguage={currentLanguage} 
              categoriesOptions={categoriesOptions} 
            />

            <FormField
              control={form.control}
              name="email_visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{texts.emailVisibleLabel}</FormLabel>
                    <FormDescription>{texts.emailVisibleDescription}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{texts.descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder={currentLanguage === "en" ? "Tell us about yourself" : "Cuéntanos sobre ti"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
