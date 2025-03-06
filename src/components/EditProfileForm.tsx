
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

  // Text labels based on language
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
    urlLabel: currentLanguage === "en" ? "URL" : "URL",
    selectPlatform: currentLanguage === "en" ? "Select platform" : "Seleccionar plataforma",
    errorMessage:
      currentLanguage === "en"
        ? "There was an error updating your profile"
        : "Hubo un error al actualizar tu perfil",
    successMessage:
      currentLanguage === "en"
        ? "Your profile has been updated"
        : "Tu perfil ha sido actualizado",
  };

  // Categories
  const categoriesOptions = [
    { id: "Legal", label: currentLanguage === "en" ? "Legal" : "Legal" },
    { id: "Tecnología", label: currentLanguage === "en" ? "Technology" : "Tecnología" },
    { id: "Finanzas", label: currentLanguage === "en" ? "Finance" : "Finanzas" },
    { id: "Audiovisual", label: currentLanguage === "en" ? "Audiovisual" : "Audiovisual" },
    { id: "Comunidad", label: currentLanguage === "en" ? "Community" : "Comunidad" },
    { id: "Salud", label: currentLanguage === "en" ? "Health" : "Salud" },
  ];

  // Form schema
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
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;

        // Set form default values
        form.reset({
          username: profile.username,
          description: profile.description || "",
          email_visible: profile.email_visible || false,
          website: profile.website || "",
          gender: profile.gender || "",
          birth_date: profile.birth_date
            ? new Date(profile.birth_date).toISOString().split("T")[0]
            : "",
          categories: profile.categories || (profile.category ? [profile.category] : []),
        });

        // Set avatar URL
        setAvatarUrl(profile.avatar_url);

        // Fetch social links
        const { data: links, error: linksError } = await supabase
          .from("social_links")
          .select("*")
          .eq("profile_id", userId);

        if (linksError) throw linksError;

        setSocialLinks(links || []);

        // Update available platforms based on existing links
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

    // Check file size (max 2MB)
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
    
    // If this is an existing link (has id), we'll delete it from DB later
    // For now, just remove it from the form state
    
    // Add the platform back to available platforms if it's a valid platform
    if (availablePlatforms.indexOf(linkToRemove.platform as SocialPlatform) === -1) {
      setAvailablePlatforms((prev) => [...prev, linkToRemove.platform as SocialPlatform]);
    }
    
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleSocialLinkChange = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...socialLinks];
    
    // If changing platform, update available platforms
    if (field === "platform") {
      const oldPlatform = newLinks[index].platform as SocialPlatform;
      
      // Add old platform back to available list
      if (availablePlatforms.indexOf(oldPlatform) === -1) {
        setAvailablePlatforms((prev) => [...prev, oldPlatform]);
      }
      
      // Remove new platform from available list
      setAvailablePlatforms((prev) => prev.filter((p) => p !== value));
    }
    
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // 1. Update avatar if changed
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
      
      // 2. Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: values.username,
          description: values.description,
          email_visible: values.email_visible,
          website: values.website,
          gender: values.gender,
          birth_date: values.birth_date,
          category: values.categories && values.categories.length > 0 ? values.categories[0] : null, // Keep the first category as the primary one
          categories: values.categories, // Store all categories
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
        
      if (updateError) throw updateError;
      
      // 3. Handle social links
      
      // Get existing links to compare
      const { data: existingLinks, error: fetchError } = await supabase
        .from("social_links")
        .select("id, platform")
        .eq("profile_id", userId);
        
      if (fetchError) throw fetchError;
      
      const existingLinksMap = new Map();
      existingLinks?.forEach(link => {
        existingLinksMap.set(link.platform, link.id);
      });
      
      // Process each social link in the form
      for (const link of socialLinks) {
        if (!link.url) continue; // Skip empty URLs
        
        if (link.id) {
          // Update existing link
          await supabase
            .from("social_links")
            .update({ platform: link.platform, url: link.url })
            .eq("id", link.id);
            
          // Remove from map to track what's left to delete
          existingLinksMap.delete(link.platform);
        } else {
          // Check if there's an existing link for this platform
          const existingId = existingLinksMap.get(link.platform);
          
          if (existingId) {
            // Update existing platform link
            await supabase
              .from("social_links")
              .update({ url: link.url })
              .eq("id", existingId);
              
            existingLinksMap.delete(link.platform);
          } else {
            // Create new link
            await supabase.from("social_links").insert({
              profile_id: userId,
              platform: link.platform,
              url: link.url,
            });
          }
        }
      }
      
      // Delete any remaining links
      for (const id of existingLinksMap.values()) {
        await supabase.from("social_links").delete().eq("id", id);
      }
      
      toast({
        title: texts.successMessage,
        description: currentLanguage === "en"
          ? "Your changes have been saved"
          : "Tus cambios han sido guardados",
      });
      
      // Redirect back to profile page
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
            {/* Avatar Section */}
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
              {/* Username */}
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

              {/* Website */}
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

              {/* Gender */}
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

              {/* Birth Date */}
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

            {/* Multiple Categories */}
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

            {/* Email Visible */}
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

            {/* Description */}
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

            {/* Social Links */}
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
                  className="grid grid-cols-[1fr_2fr_auto] gap-3 items-center"
                >
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

                  <Input
                    value={link.url}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "url", e.target.value)
                    }
                    placeholder={`https://...`}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSocialLink(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Form Actions */}
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
