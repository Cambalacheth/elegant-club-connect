
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState<string>("es");

  useEffect(() => {
    // Get the preferred language from localStorage
    const storedLanguage = localStorage.getItem("preferredLanguage");
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
    }

    // Check if this is the current user's profile
    const checkCurrentUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const currentUsername = session.user.email?.split('@')[0];
        if (currentUsername === username) {
          setIsOwnProfile(true);
          setUser(session.user);
        }
      }
      
      // If not own profile, we would fetch the public profile data here
      // For now, we'll just simulate it
      if (!isOwnProfile) {
        // In a real app, you would query your database for the user profile
        // For this demo, we'll just create a mock user
        setUser({
          username: username,
          email: `${username}@example.com`,
          // Add other public user data here
        });
      }
      
      setLoading(false);
    };

    checkCurrentUser();
  }, [username]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Navbar currentLanguage={currentLanguage} />
        <div className="container mx-auto px-6 pt-32 pb-16">
          <div className="flex justify-center items-center h-64">
            <p className="text-club-brown">Cargando perfil...</p>
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-club-olive/20 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-club-olive/30 flex items-center justify-center">
                <User size={48} className="text-club-brown" />
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-semibold text-club-brown">{username}</h1>
                {user?.email && <p className="text-club-brown/70 mt-1">{user.email}</p>}
              </div>
              
              {isOwnProfile && (
                <div className="ml-auto mt-4 md:mt-0">
                  <button 
                    className="inline-flex items-center gap-2 bg-club-beige px-4 py-2 rounded-md text-club-brown hover:bg-club-beige-dark transition-colors"
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
            <h2 className="text-xl font-semibold text-club-brown mb-4">
              {currentLanguage === "en" ? "Profile" : "Perfil"}
            </h2>
            
            <div className="bg-club-beige/40 p-6 rounded-lg">
              <p className="text-club-brown/80 italic">
                {isOwnProfile 
                  ? (currentLanguage === "en" 
                      ? "This is your public profile. Other users can see this information."
                      : "Este es tu perfil público. Otros usuarios pueden ver esta información.")
                  : (currentLanguage === "en"
                      ? "This is a public profile."
                      : "Este es un perfil público.")}
              </p>
              
              {/* Here you would display the user's public information */}
              <div className="mt-6 space-y-4">
                <div className="border-b border-club-olive/20 pb-4">
                  <h3 className="text-sm text-club-brown/60 mb-1">
                    {currentLanguage === "en" ? "Username" : "Nombre de usuario"}
                  </h3>
                  <p className="text-club-brown">{username}</p>
                </div>
                
                {/* Add more profile fields here as needed */}
                <div className="border-b border-club-olive/20 pb-4">
                  <h3 className="text-sm text-club-brown/60 mb-1">
                    {currentLanguage === "en" ? "Member Since" : "Miembro desde"}
                  </h3>
                  <p className="text-club-brown">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
