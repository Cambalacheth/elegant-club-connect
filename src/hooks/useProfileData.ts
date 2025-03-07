
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile, SocialLink } from "@/types/profile";
import { Project } from "@/types/project";

export const useProfileData = (username: string | undefined, currentLanguage: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setCurrentUser(session.user);
          
          const { data: currentUserProfile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .single();
            
          if (currentUserProfile && currentUserProfile.username === username) {
            setIsOwnProfile(true);
          }
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();
        
        if (profileError || !profileData) {
          throw new Error("Profile not found");
        }
        
        setProfile(profileData);
        
        const { data: socialData } = await supabase
          .from("social_links")
          .select("*")
          .eq("profile_id", profileData.id);
          
        if (socialData) {
          setSocialLinks(socialData);
        }
        
        const { data: projectsData } = await supabase
          .from("projects")
          .select("*")
          .eq("profile_id", profileData.id);
          
        if (projectsData) {
          setProjects(projectsData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: currentLanguage === "en" ? "Error" : "Error",
          description: currentLanguage === "en" 
            ? "Profile not found or error loading profile" 
            : "Perfil no encontrado o error al cargar el perfil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username, toast, currentLanguage]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: currentLanguage === "en" ? "Signed out" : "Sesión cerrada",
        description: currentLanguage === "en" 
          ? "You have been signed out successfully." 
          : "Has cerrado sesión correctamente.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: currentLanguage === "en" ? "Error" : "Error",
        description: currentLanguage === "en"
          ? "Could not sign out. Please try again."
          : "No se pudo cerrar la sesión. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return {
    profile,
    socialLinks,
    projects,
    currentUser,
    isOwnProfile,
    loading,
    isEditing,
    handleSignOut,
    handleEditProfile,
    handleCancelEdit
  };
};
