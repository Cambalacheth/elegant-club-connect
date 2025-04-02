
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
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setCurrentUser(session.user);
          
          // Get current user's profile to check if viewing own profile
          const { data: currentUserProfile, error: currentUserError } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .maybeSingle();
            
          if (currentUserError) {
            console.error("Error fetching current user profile:", currentUserError);
          }
            
          if (currentUserProfile && currentUserProfile.username === username) {
            setIsOwnProfile(true);
          }
        }
        
        // Get profile data for the username being viewed
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();
        
        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw new Error(profileError.message);
        }
        
        if (!profileData) {
          throw new Error("Profile not found");
        }

        // Create a new profile object with the email property and default values for missing fields
        const profileWithEmail: Profile = {
          ...profileData,
          experience: profileData.experience !== undefined ? profileData.experience : 0,
          level: profileData.level_numeric !== undefined ? profileData.level_numeric : 1,
          email: session?.user && profileData.id === session.user.id ? session.user.email : null
        };
        
        setProfile(profileWithEmail);
        
        // Get social links for this profile
        const { data: socialData, error: socialError } = await supabase
          .from("social_links")
          .select("*")
          .eq("profile_id", profileData.id);
          
        if (socialError) {
          console.error("Social links fetch error:", socialError);
        } else if (socialData) {
          setSocialLinks(socialData);
        }
        
        // Get projects for this profile
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("profile_id", profileData.id);
          
        if (projectsError) {
          console.error("Projects fetch error:", projectsError);
        } else if (projectsData) {
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
