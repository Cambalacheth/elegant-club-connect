
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MeRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const redirectToUserProfile = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session, redirecting to auth");
          // If not logged in, redirect to auth page
          navigate('/auth');
          return;
        }
        
        console.log("User session found:", session.user.id);
        
        // Fetch the username from the profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "No se pudo cargar tu perfil. Por favor intenta nuevamente.",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }
        
        if (!profile) {
          console.error('Profile not found for user ID:', session.user.id);
          toast({
            title: "Perfil no encontrado",
            description: "No se encontró tu perfil. Por favor contacta a soporte.",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }
        
        console.log("Profile found, username:", profile.username);
        
        // Redirect to the actual user profile page
        navigate(`/user/${profile.username}`, { replace: true });
      } catch (error) {
        console.error('Error in redirect:', error);
        toast({
          title: "Error",
          description: "Ocurrió un error al redireccionarte. Por favor intenta nuevamente.",
          variant: "destructive"
        });
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    
    redirectToUserProfile();
  }, [navigate, toast]);
  
  return (
    <div className="flex justify-center items-center h-screen bg-club-beige">
      <p className="text-club-brown">Redirigiendo...</p>
    </div>
  );
};

export default MeRedirect;
