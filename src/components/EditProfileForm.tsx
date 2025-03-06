import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Instagram, Twitter, Github, Linkedin, Music, Youtube, 
  Video, Link as LinkIcon, Mail, PlusCircle, X, Upload, Trash2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Profile, SocialLink, Project, SocialPlatform } from "@/types/profile";
import { socialPlatformLabels } from "@/types/profile";

interface EditProfileFormProps {
  userId: string;
  currentLanguage: string;
  onCancel: () => void;
}

const EditProfileForm = ({ userId, currentLanguage, onCancel }: EditProfileFormProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [emailVisible, setEmailVisible] = useState(false);
  const [gender, setGender] = useState("not_specified");
  const [birthDate, setBirthDate] = useState("");
  
  const [socialLinks, setSocialLinks] = useState<{platform: SocialPlatform, url: string}[]>([]);
  const [projects, setProjects] = useState<{id?: string, name: string, description: string, url: string}[]>([]);
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const texts = {
    title: currentLanguage === "en" ? "Edit Profile" : "Editar Perfil",
    save: currentLanguage === "en" ? "Save Changes" : "Guardar Cambios",
    cancel: currentLanguage === "en" ? "Cancel" : "Cancelar",
    username: currentLanguage === "en" ? "Username" : "Nombre de usuario",
    usernameHelp: currentLanguage === "en" 
      ? "Username must be unique and can only contain letters, numbers, and underscores" 
      : "El nombre de usuario debe ser único y solo puede contener letras, números y guiones bajos",
    website: currentLanguage === "en" ? "Website" : "Sitio web",
    description: currentLanguage === "en" ? "About Me" : "Sobre Mí",
    gender: currentLanguage === "en" ? "Gender" : "Género",
    birthDate: currentLanguage === "en" ? "Birth Date" : "Fecha de nacimiento",
    privacyNote: currentLanguage === "en" 
      ? "Gender and birth date will not be displayed publicly" 
      : "El género y la fecha de nacimiento no se mostrarán públicamente",
    emailVisibility: currentLanguage === "en" 
      ? "Show my email on my public profile" 
      : "Mostrar mi correo electrónico en mi perfil público",
    male: currentLanguage === "en" ? "Male" : "Masculino",
    female: currentLanguage === "en" ? "Female" : "Femenino",
    other: currentLanguage === "en" ? "Other" : "Otro",
    notSpecified: currentLanguage === "en" ? "Prefer not to say" : "Prefiero no decir",
    uploadAvatar: currentLanguage === "en" ? "Upload Photo" : "Subir Foto",
    changeAvatar: currentLanguage === "en" ? "Change Photo" : "Cambiar Foto",
    removeAvatar: currentLanguage === "en" ? "Remove" : "Eliminar",
    socialLinks: currentLanguage === "en" ? "Social Links" : "Redes Sociales",
    addSocialLink: currentLanguage === "en" ? "Add Social Link" : "Agregar Red Social",
    platform: currentLanguage === "en" ? "Platform" : "Plataforma",
    url: currentLanguage === "en" ? "URL" : "URL",
    projects: currentLanguage === "en" ? "Projects" : "Proyectos",
    addProject: currentLanguage === "en" ? "Add Project" : "Agregar Proyecto",
    projectName: currentLanguage === "en" ? "Project Name" : "Nombre del Proyecto",
    projectDesc: currentLanguage === "en" ? "Description" : "Descripción",
    projectUrl: currentLanguage === "en" ? "Project URL" : "URL del Proyecto",
    loading: currentLanguage === "en" ? "Loading..." : "Cargando...",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) throw profileError;
        
        const { data: socialData, error: socialError } = await supabase
          .from("social_links")
          .select("*")
          .eq("profile_id", userId);
        
        if (socialError) throw socialError;
        
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("profile_id", userId);
        
        if (projectsError) throw projectsError;
        
        setProfile(profileData);
        setUsername(profileData.username || "");
        setWebsite(profileData.website || "");
        setDescription(profileData.description || "");
        setEmailVisible(profileData.email_visible || false);
        setGender(profileData.gender || "not_specified");
        setBirthDate(profileData.birth_date || "");
        setAvatarUrl(profileData.avatar_url);
        
        const formattedSocialLinks = socialData.map(link => ({
          platform: link.platform as SocialPlatform,
          url: link.url
        }));
        setSocialLinks(formattedSocialLinks.length > 0 ? formattedSocialLinks : []);
        
        const formattedProjects = projectsData.map(project => ({
          id: project.id,
          name: project.name || "",
          description: project.description || "",
          url: project.url || ""
        }));
        setProjects(formattedProjects.length > 0 ? formattedProjects : [{ name: "", description: "", url: "" }]);
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: currentLanguage === "en" ? "Error" : "Error",
          description: currentLanguage === "en" 
            ? "Could not load profile. Please try again." 
            : "No se pudo cargar el perfil. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId, currentLanguage, toast]);

  const validateUsername = async (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameError(currentLanguage === "en" 
        ? "Username can only contain letters, numbers, and underscores" 
        : "El nombre de usuario solo puede contener letras, números y guiones bajos");
      return false;
    }
    
    if (profile?.username !== username) {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking username:", error);
        setUsernameError(currentLanguage === "en" 
          ? "Error checking username availability" 
          : "Error al verificar la disponibilidad del nombre de usuario");
        return false;
      }
      
      if (data) {
        setUsernameError(currentLanguage === "en" 
          ? "Username is already taken" 
          : "Este nombre de usuario ya está en uso");
        return false;
      }
    }
    
    setUsernameError("");
    return true;
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "instagram", url: "" }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };

  const handleSocialLinkChange = (index: number, field: "platform" | "url", value: string) => {
    const updatedLinks = [...socialLinks];
    if (field === "platform") {
      updatedLinks[index].platform = value as SocialPlatform;
    } else {
      updatedLinks[index].url = value;
    }
    setSocialLinks(updatedLinks);
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: "", description: "", url: "" }]);
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  };

  const handleProjectChange = (index: number, field: keyof Omit<typeof projects[0], "id">, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const isUsernameValid = await validateUsername(username);
      if (!isUsernameValid) {
        setIsSubmitting(false);
        return;
      }
      
      let avatarPath = profile?.avatar_url || null;
      if (avatarFile) {
        if (profile?.avatar_url) {
          const oldAvatarPath = profile.avatar_url.split('/').pop();
          if (oldAvatarPath) {
            await supabase.storage.from('avatars').remove([oldAvatarPath]);
          }
        }
        
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${userId}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatarPath = publicUrlData.publicUrl;
      } else if (avatarUrl === null && profile?.avatar_url) {
        const oldAvatarPath = profile.avatar_url.split('/').pop();
        if (oldAvatarPath) {
          await supabase.storage.from('avatars').remove([oldAvatarPath]);
        }
      }
      
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username,
          avatar_url: avatarPath,
          website,
          description,
          email_visible: emailVisible,
          gender,
          birth_date: birthDate || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
      
      if (profileError) throw profileError;
      
      if (socialLinks.length > 0) {
        await supabase
          .from("social_links")
          .delete()
          .eq("profile_id", userId);
        
        const socialLinksToInsert = socialLinks
          .filter(link => link.url.trim() !== "")
          .map(link => ({
            profile_id: userId,
            platform: link.platform,
            url: link.url
          }));
        
        if (socialLinksToInsert.length > 0) {
          const { error: socialLinksError } = await supabase
            .from("social_links")
            .insert(socialLinksToInsert);
            
          if (socialLinksError) throw socialLinksError;
        }
      }
      
      const existingProjectIds = projects
        .filter(p => p.id)
        .map(p => p.id) as string[];
      
      if (existingProjectIds.length > 0) {
        await supabase
          .from("projects")
          .delete()
          .eq("profile_id", userId)
          .not("id", "in", existingProjectIds);
      } else {
        await supabase
          .from("projects")
          .delete()
          .eq("profile_id", userId);
      }
      
      for (const project of projects) {
        if (project.name.trim() === "") continue;
        
        if (project.id) {
          await supabase
            .from("projects")
            .update({
              name: project.name,
              description: project.description || null,
              url: project.url || null,
              updated_at: new Date().toISOString()
            })
            .eq("id", project.id);
        } else {
          await supabase
            .from("projects")
            .insert({
              profile_id: userId,
              name: project.name,
              description: project.description || null,
              url: project.url || null
            });
        }
      }
      
      toast({
        title: currentLanguage === "en" ? "Success" : "Éxito",
        description: currentLanguage === "en" 
          ? "Profile updated successfully" 
          : "Perfil actualizado con éxito",
      });
      
      navigate(`/user/${username}`);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: currentLanguage === "en" ? "Error" : "Error",
        description: currentLanguage === "en" 
          ? "Could not update profile. Please try again." 
          : "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSocialIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "instagram": return <Instagram size={18} />;
      case "twitter": return <Twitter size={18} />;
      case "github": return <Github size={18} />;
      case "linkedin": return <Linkedin size={18} />;
      case "spotify": return <Music size={18} />;
      case "youtube": return <Youtube size={18} />;
      case "tiktok": return <Video size={18} />;
      case "website": return <LinkIcon size={18} />;
      case "email": return <Mail size={18} />;
      default: return <LinkIcon size={18} />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-club-brown">{texts.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-club-olive/20 p-6">
        <h2 className="text-2xl font-semibold text-club-brown">{texts.title}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full bg-club-olive/30 flex items-center justify-center overflow-hidden"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Upload size={32} className="text-club-brown/70" />
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAvatarUpload}
              className="bg-club-beige px-4 py-2 rounded-md text-club-brown hover:bg-club-beige-dark transition-colors text-sm"
            >
              {avatarUrl ? texts.changeAvatar : texts.uploadAvatar}
            </button>
            
            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="bg-club-terracota/10 px-4 py-2 rounded-md text-club-terracota hover:bg-club-terracota/20 transition-colors text-sm flex items-center justify-center gap-1"
              >
                <Trash2 size={14} />
                {texts.removeAvatar}
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-club-brown mb-1">
              {texts.username} <span className="text-club-terracota">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                validateUsername(e.target.value);
              }}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                usernameError ? "border-club-terracota focus:ring-club-terracota/30" : "border-club-olive/50 focus:ring-club-orange/30"
              }`}
            />
            {usernameError && (
              <p className="text-club-terracota text-sm mt-1">{usernameError}</p>
            )}
            <p className="text-club-brown/60 text-xs mt-1">{texts.usernameHelp}</p>
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-club-brown mb-1">
              {texts.website}
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-club-brown mb-1">
              {texts.description}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
            />
          </div>
        </div>
        
        <div className="space-y-4 pb-4 border-b border-club-olive/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-club-brown mb-1">
                {texts.gender}
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
              >
                <option value="male">{texts.male}</option>
                <option value="female">{texts.female}</option>
                <option value="other">{texts.other}</option>
                <option value="not_specified">{texts.notSpecified}</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-club-brown mb-1">
                {texts.birthDate}
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
              />
            </div>
          </div>
          
          <p className="text-club-brown/60 text-xs italic">{texts.privacyNote}</p>
          
          <div className="flex items-center">
            <input
              id="emailVisible"
              type="checkbox"
              checked={emailVisible}
              onChange={(e) => setEmailVisible(e.target.checked)}
              className="h-4 w-4 text-club-orange focus:ring-club-orange/30 border-club-olive/50 rounded"
            />
            <label htmlFor="emailVisible" className="ml-2 block text-sm text-club-brown">
              {texts.emailVisibility}
            </label>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-club-brown">{texts.socialLinks}</h3>
          
          {socialLinks.map((link, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex-shrink-0 w-full sm:w-1/4">
                <select
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, "platform", e.target.value)}
                  className="w-full px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
                >
                  {Object.entries(socialPlatformLabels).map(([platform, labels]) => (
                    <option key={platform} value={platform}>
                      {currentLanguage === "en" ? labels.en : labels.es}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2 flex-1">
                <div className="flex-shrink-0">
                  {getSocialIcon(link.platform)}
                </div>
                
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                  placeholder={`https://${link.platform}.com/yourusername`}
                  className="flex-1 px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
                />
                
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="text-club-terracota hover:text-club-terracota/70 transition-colors p-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="inline-flex items-center text-club-orange hover:text-club-terracota transition-colors text-sm"
          >
            <PlusCircle size={16} className="mr-1" />
            {texts.addSocialLink}
          </button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-club-brown">{texts.projects}</h3>
          
          {projects.map((project, index) => (
            <div key={index} className="p-4 bg-club-beige/30 rounded-md space-y-3">
              <div className="flex justify-between">
                <label htmlFor={`project-name-${index}`} className="block text-sm font-medium text-club-brown mb-1">
                  {texts.projectName} {index === 0 && <span className="text-club-terracota">*</span>}
                </label>
                
                {projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(index)}
                    className="text-club-terracota hover:text-club-terracota/70 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              <input
                id={`project-name-${index}`}
                type="text"
                value={project.name}
                onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                required={index === 0}
                className="w-full px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
              />
              
              <div>
                <label htmlFor={`project-desc-${index}`} className="block text-sm font-medium text-club-brown mb-1">
                  {texts.projectDesc}
                </label>
                <textarea
                  id={`project-desc-${index}`}
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
                />
              </div>
              
              <div>
                <label htmlFor={`project-url-${index}`} className="block text-sm font-medium text-club-brown mb-1">
                  {texts.projectUrl}
                </label>
                <input
                  id={`project-url-${index}`}
                  type="url"
                  value={project.url}
                  onChange={(e) => handleProjectChange(index, "url", e.target.value)}
                  placeholder="https://example.com/project"
                  className="w-full px-4 py-2 border border-club-olive/50 rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange/30"
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center text-club-orange hover:text-club-terracota transition-colors text-sm"
          >
            <PlusCircle size={16} className="mr-1" />
            {texts.addProject}
          </button>
        </div>
        
        <div className="flex justify-end gap-4 pt-4 border-t border-club-olive/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-club-olive/50 rounded-md text-club-brown hover:bg-club-beige transition-colors"
          >
            {texts.cancel}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-club-orange rounded-md text-white hover:bg-club-terracota transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {currentLanguage === "en" ? "Saving..." : "Guardando..."}
              </span>
            ) : (
              texts.save
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;

