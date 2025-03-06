
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error confirming email:", error);
        toast({
          title: "Error de verificación",
          description: "Ha ocurrido un error al verificar tu correo electrónico.",
          variant: "destructive",
        });
        navigate("/auth");
      } else {
        toast({
          title: "Email verificado",
          description: "Tu correo electrónico ha sido verificado correctamente.",
        });
        navigate("/home");
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-club-beige">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-club-brown mb-4">Verificando...</h1>
        <p className="text-club-brown/80">Estamos procesando tu verificación de correo electrónico.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
