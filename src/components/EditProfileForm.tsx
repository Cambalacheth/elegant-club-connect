import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import { SocialPlatform, socialPlatformLabels } from "@/types/profile";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const texts = {
    title: currentLanguage === "en" ? "Edit Profile" : "Editar Perfil",
    saveButton: currentLanguage === "en" ? "Save Changes" : "Guardar Cambios",
    cancelButton: currentLanguage === "en" ? "Cancel" : "Cancelar",
    usernameLabel: currentLanguage === "en" ? "Username" : "Nombre de usuario",
    descriptionLabel: currentLanguage === "en" ? "Bio" : "Biografía",
    emailVisibleLabel: currentLanguage === "en" ? "Email Visible" : "Email Visible",
    emailVisibleDescription:
      currentLanguage === "en"
        ? "Make your email visible to other users"
        : "Hacer tu email visible para otros usuarios",
    websiteLabel: currentLanguage === "en" ? "Website" : "Sitio Web",
    genderLabel: currentLanguage === "en" ? "Gender" : "Género",
    genderMale: currentLanguage === "en" ? "Male" : "Masculino",
    genderFemale: currentLanguage === "en" ? "Female" : "Femenino",
    genderOther: currentLanguage === "en" ? "Other" : "Otro",
    categoriesLabel: currentLanguage === "en" ? "Categories" : "Categorías",
    selectCategoriesText: currentLanguage === "en" ? "Select categories of interest" : "Selecciona categorías de interés",
    birthDateLabel: currentLanguage === "en" ? "Birth Date" : "Fecha de Nacimiento",
    avatarLabel: currentLanguage === "en" ? "Profile Picture" : "Foto de Perfil",
    socialLinksLabel: currentLanguage === "en" ? "Social Links" : "Enlaces Sociales",
    addSocialLink: currentLanguage === "en" ? "Add Social Link" : "Añadir Enlace Social",
    platformLabel: currentLanguage === "en" ? "Platform" : "Plataforma",
    urlLabel: currentLanguage === "en" ? "Username" : "Nombre de Usuario",
    selectPlatform: currentLanguage === "en" ? "Select platform" : "Seleccionar plataforma",
    successMessage: currentLanguage === "en" ? "Success" : "Éxito",
    errorMessage: currentLanguage === "en" 
      ? "There was an error updating your profile" 
      : "Hubo un error al actualizar tu perfil"
  };

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
        toast({
          title: "Error",
          description: currentLanguage === "en"
            ? "Could not load profile data"
            : "No se pudieron cargar los datos del perfil",
          variant: "destructive",
        });
      }
    };

    fetchProfileData();
  }, [userId, form, toast, currentLanguage]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: currentLanguage === "en" ? "File too large" : "Archivo demasiado grande",
        description: currentLanguage === "en"
          ? "Image must be less than 2MB"
          : "La imagen debe ser menor a 2MB",
        variant: "destructive",
      });
      return;
    }

    setAvatarFile(file);
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
  };

  const handleAddSocialLink = () => {
    if (availablePlatforms.length === 0) return;

    setSocialLinks([
      ...socialLinks,
      {
        platform: availablePlatforms[0],
        url: "",
      },
    ]);

    setAvailablePlatforms((prev) => prev.filter((p) => p !== availablePlatforms[0]));
  };

  const handleRemoveSocialLink = (index: number) => {
    const linkToRemove = socialLinks[index];
    
    if (availablePlatforms.indexOf(linkToRemove.platform as SocialPlatform) === -1) {
      setAvailablePlatforms((prev) => [...prev, linkToRemove.platform as SocialPlatform]);
    }
    
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleSocialLinkChange = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...socialLinks];
    
    if (field === "platform") {
      const oldPlatform = newLinks[index].platform as SocialPlatform;
      
      if (availablePlatforms.indexOf(oldPlatform) === -1) {
        setAvailablePlatforms((prev) => [...prev, oldPlatform]);
      }
      
      setAvailablePlatforms((prev) => prev.filter((p) => p !== value));
    }
    
    if (field === "url" && value.startsWith("http")) {
      if (newLinks[index].platform === "instagram" && value.includes("instagram.com/")) {
        value = value.split("instagram.com/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "twitter" && value.includes("twitter.com/")) {
        value = value.split("twitter.com/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "github" && value.includes("github.com/")) {
        value = value.split("github.com/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "linkedin" && value.includes("linkedin.com/in/")) {
        value = value.split("linkedin.com/in/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "youtube" && value.includes("youtube.com/")) {
        value = value.includes("youtube.com/@") 
          ? value.split("youtube.com/@")[1].split("/")[0].split("?")[0]
          : value.split("youtube.com/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "tiktok" && value.includes("tiktok.com/")) {
        value = value.includes("tiktok.com/@") 
          ? value.split("tiktok.com/@")[1].split("/")[0].split("?")[0]
          : value.split("tiktok.com/")[1].split("/")[0].split("?")[0];
      }
    }
    
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        title: texts.successMessage,
        description: currentLanguage === "en"
          ? "Your changes have been saved"
          : "Tus cambios han sido guardados",
      });
      
      navigate(`/user/${values.username}`);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: texts.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-club-olive/30 flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-club-brown" />
                )}
              </div>
              <div className="flex-1">
                <FormLabel>{texts.avatarLabel}</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-club-beige file:text-club-brown hover:file:bg-club-beige/80"
                />
              </div>
            </div>

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

            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <FormLabel>{texts.categoriesLabel}</FormLabel>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {texts.selectCategoriesText}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {categoriesOptions.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="categories"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], category.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== category.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {category.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>{texts.socialLinksLabel}</FormLabel>
                {availablePlatforms.length > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddSocialLink}
                  >
                    <Plus className="mr-2 h-4 w-4" /> {texts.addSocialLink}
                  </Button>
                )}
              </div>

              {socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="space-y-2 border p-4 rounded-md"
                >
                  <div className="grid grid-cols-[1fr_2fr_auto] gap-3 items-start">
                    <div>
                      <FormLabel>{texts.platformLabel}</FormLabel>
                      <Select
                        value={link.platform}
                        onValueChange={(value) =>
                          handleSocialLinkChange(index, "platform", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={texts.selectPlatform} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={link.platform}>
                            {socialPlatformLabels[link.platform as SocialPlatform][
                              currentLanguage === "en" ? "en" : "es"
                            ]}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <FormLabel>{texts.urlLabel}</FormLabel>
                      <Input
                        value={link.url}
                        onChange={(e) =>
                          handleSocialLinkChange(index, "url", e.target.value)
                        }
                        placeholder={
                          link.platform === "instagram" ? "username" :
                          link.platform === "twitter" ? "username" :
                          link.platform === "github" ? "username" :
                          link.platform === "linkedin" ? "username" :
                          link.platform === "youtube" ? "@channel" :
                          link.platform === "tiktok" ? "@username" :
                          link.platform === "spotify" ? "username" :
                          link.platform === "website" ? "example.com" :
                          link.platform === "email" ? "you@example.com" : ""
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">{texts.urlDescription}</p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => handleRemoveSocialLink(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

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
