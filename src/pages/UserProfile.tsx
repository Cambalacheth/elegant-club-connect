
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Settings, Instagram, Twitter, Github, 
  Linkedin, Music, Youtube, Video, Link as LinkIcon, 
  Mail, ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import EditProfileForm from "@/components/EditProfileForm";
import type { Profile, SocialLink, Project, SocialPlatform } from "@/types/profile";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState<string>("es");

  useEffect(() => {
    // Get the preferred language from localStorage
    const storedLanguage = localStorage.getItem("preferredLanguage");
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
    }

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Check if this is the current user's profile
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setCurrentUser(session.user);
          
          // Fetch the current user's username from the profiles table
          const { data: currentUserProfile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .single();
            
          // Check if the current URL username matches the logged in user's username
          if (currentUserProfile && currentUserProfile.username === username) {
            setIsOwnProfile(true);
          }
        }
        
        // Fetch profile by username
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();
        
        if (profileError || !profileData) {
          throw new Error("Profile not found");
        }
        
        setProfile(profileData);
        
        // Fetch social links
        const { data: socialData } = await supabase
          .from("social_links")
          .select("*")
          .eq("profile_id", profileData.id);
          
        if (socialData) {
          setSocialLinks(socialData);
        }
        
        // Fetch projects
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

    fetchProfileData();
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
  
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <Instagram size={20} className="text-club-brown" />;
      case "twitter": return <Twitter size={20} className="text-club-brown" />;
      case "github": return <Github size={20} className="text-club-brown" />;
      case "linkedin": return <Linkedin size={20} className="text-club-brown" />;
      case "spotify": return <Music size={20} className="text-club-brown" />;
      case "youtube": return <Youtube size={20} className="text-club-brown" />;
      case "tiktok": return <Video size={20} className="text-club-brown" />;
      case "website": return <LinkIcon size={20} className="text-club-brown" />;
      case "email": return <Mail size={20} className="text-club-brown" />;
      default: return <LinkIcon size={20} className="text-club-brown" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Navbar currentLanguage={currentLanguage} />
        <div className="container mx-auto px-6 pt-32 pb-16">
          <div className="flex justify-center items-center h-64">
            <p className="text-club-brown">
              {currentLanguage === "en" ? "Loading profile..." : "Cargando perfil..."}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Navbar currentLanguage={currentLanguage} />
        <div className="container mx-auto px-6 pt-32 pb-16">
          <div className="flex justify-center items-center h-64 flex-col gap-4">
            <p className="text-club-brown text-xl">
              {currentLanguage === "en" ? "Profile not found" : "Perfil no encontrado"}
            </p>
            <button 
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-club-orange rounded-md text-white hover:bg-club-terracota transition-colors"
            >
              {currentLanguage === "en" ? "Return to Home" : "Volver al Inicio"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-club-beige">
      <Navbar currentLanguage={currentLanguage} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-club-brown hover:text-club-terracota transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {currentLanguage === "en" ? "Back" : "Volver"}
        </button>

        {isEditing ? (
          <EditProfileForm 
            userId={profile.id} 
            currentLanguage={currentLanguage} 
            onCancel={handleCancelEdit} 
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-club-olive/20 p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-club-olive/30 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={`${profile.username}'s avatar`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-club-brown" />
                  )}
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-semibold text-club-brown">{profile.username}</h1>
                  {profile.email_visible && currentUser?.email && (
                    <p className="text-club-brown/70 mt-1">{currentUser.email}</p>
                  )}
                  <div className="mt-2">
                    <span className="inline-block bg-club-olive/20 px-3 py-1 rounded-full text-sm text-club-brown">
                      {profile.level || (profile.gender === "female" ? "Terretiana" : "Terretiano")}
                    </span>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <div className="ml-auto mt-4 md:mt-0">
                    <button 
                      className="inline-flex items-center gap-2 bg-club-beige px-4 py-2 rounded-md text-club-brown hover:bg-club-beige-dark transition-colors"
                      onClick={handleEditProfile}
                    >
                      <Settings size={18} />
                      {currentLanguage === "en" ? "Edit Profile" : "Editar Perfil"}
                    </button>
                    
                    <button 
                      onClick={handleSignOut}
                      className="ml-3 inline-flex items-center gap-2 bg-club-terracota/10 px-4 py-2 rounded-md text-club-terracota hover:bg-club-terracota/20 transition-colors"
                    >
                      {currentLanguage === "en" ? "Sign Out" : "Cerrar Sesión"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  {profile.description && (
                    <div>
                      <h2 className="text-xl font-semibold text-club-brown mb-4">
                        {currentLanguage === "en" ? "About" : "Acerca de"}
                      </h2>
                      <div className="bg-club-beige/40 p-6 rounded-lg">
                        <p className="text-club-brown whitespace-pre-line">{profile.description}</p>
                      </div>
                    </div>
                  )}
                  
                  {projects.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-club-brown mb-4">
                        {currentLanguage === "en" ? "Projects" : "Proyectos"}
                      </h2>
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="bg-club-beige/40 p-6 rounded-lg">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-medium text-club-brown">{project.name}</h3>
                              {project.url && (
                                <a 
                                  href={project.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-club-orange hover:text-club-terracota transition-colors"
                                >
                                  <ExternalLink size={18} />
                                </a>
                              )}
                            </div>
                            {project.description && (
                              <p className="text-club-brown/90 mt-2">{project.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Links Section */}
                  {(profile.website || socialLinks.length > 0 || profile.email_visible) && (
                    <div>
                      <h2 className="text-xl font-semibold text-club-brown mb-4">
                        {currentLanguage === "en" ? "Links" : "Enlaces"}
                      </h2>
                      <div className="bg-club-beige/40 p-6 rounded-lg space-y-3">
                        {profile.website && (
                          <a 
                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-club-brown hover:text-club-terracota transition-colors py-1"
                          >
                            <LinkIcon size={20} />
                            <span className="truncate">{profile.website}</span>
                          </a>
                        )}
                        
                        {profile.email_visible && currentUser?.email && (
                          <a 
                            href={`mailto:${currentUser.email}`}
                            className="flex items-center gap-3 text-club-brown hover:text-club-terracota transition-colors py-1"
                          >
                            <Mail size={20} />
                            <span className="truncate">{currentUser.email}</span>
                          </a>
                        )}
                        
                        {socialLinks.map((link) => (
                          <a 
                            key={link.id}
                            href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-club-brown hover:text-club-terracota transition-colors py-1"
                          >
                            {getSocialIcon(link.platform)}
                            <span className="truncate">
                              {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Member Since */}
                  <div>
                    <h2 className="text-xl font-semibold text-club-brown mb-4">
                      {currentLanguage === "en" ? "Member Since" : "Miembro desde"}
                    </h2>
                    <div className="bg-club-beige/40 p-6 rounded-lg">
                      <p className="text-club-brown">
                        {new Date(profile.created_at).toLocaleDateString(
                          currentLanguage === "en" ? "en-US" : "es-ES",
                          { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
