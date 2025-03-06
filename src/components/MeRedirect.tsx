
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const MeRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const redirectToUserProfile = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          // If not logged in, redirect to auth page
          navigate('/auth');
          return;
        }
        
        // Fetch the username from the profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
          
        if (error || !profile) {
          console.error('Error fetching profile:', error);
          navigate('/auth');
          return;
        }
        
        // Redirect to the actual user profile page
        navigate(`/user/${profile.username}`, { replace: true });
      } catch (error) {
        console.error('Error in redirect:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    
    redirectToUserProfile();
  }, [navigate]);
  
  return (
    <div className="flex justify-center items-center h-screen bg-club-beige">
      <p className="text-club-brown">Redirigiendo...</p>
    </div>
  );
};

export default MeRedirect;
