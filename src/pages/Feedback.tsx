
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NavbarWithDefaultLang from "@/components/Navbar";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const Feedback = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async (content: string, isAnonymous: boolean) => {
    setLoading(true);
    try {
      const feedbackData: any = {
        content,
        is_anonymous: isAnonymous
      };
      
      // Only set user_id and username if not anonymous and user is logged in
      if (user && !isAnonymous) {
        feedbackData.user_id = user.id;
        
        // Get username from profiles if available
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
          
        if (profileData?.username) {
          feedbackData.username = profileData.username;
        }
        
        // Add experience points if feedback is not anonymous (50 XP, up to 500 total)
        await supabase.rpc('add_user_xp', { 
          _user_id: user.id,
          _action_name: 'submit_feedback',
          _custom_description: 'Envío de feedback'
        });
      }
      
      const { error } = await supabase
        .from('feedback')
        .insert([feedbackData as any]);
      
      if (error) throw error;
      
      toast({
        title: "¡Gracias por tu opinión!",
        description: "Hemos recibido tu feedback correctamente.",
      });
      
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar tu feedback. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Feedback | Terreta Hub</title>
        <meta name="description" content="Comparte tu opinión sobre Terreta Hub y ayúdanos a mejorar" />
      </Helmet>
      
      <NavbarWithDefaultLang />
      
      <div className="pt-24 pb-16 px-4 min-h-screen bg-club-beige-light">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-club-brown mb-6">
            Tu opinión es importante
          </h1>
          
          <p className="text-lg text-club-brown mb-8">
            Ayúdanos a mejorar Terreta Hub compartiendo tus ideas, sugerencias o reportando problemas.
            {!user && " Puedes enviar tu feedback aunque no hayas iniciado sesión."}
          </p>
          
          <FeedbackForm 
            onSubmit={handleSubmitFeedback} 
            loading={loading} 
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </>
  );
};

export default Feedback;
