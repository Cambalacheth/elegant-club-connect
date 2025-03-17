
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      setLoading(true);
      
      // Check if this is a password reset callback
      const isReset = searchParams.get("reset") === "true";
      
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          toast({
            title: "Error de autenticación",
            description: error.message || "Ha ocurrido un error al procesar tu solicitud.",
            variant: "destructive",
          });
        } else {
          setSuccess(true);
          
          if (isReset) {
            toast({
              title: "Contraseña actualizada",
              description: "Tu contraseña ha sido actualizada correctamente.",
            });
          } else {
            toast({
              title: "Autenticación exitosa",
              description: "Has iniciado sesión correctamente.",
            });
          }
          
          // Redirect after a brief delay
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message);
        toast({
          title: "Error de autenticación",
          description: err.message || "Ha ocurrido un error al procesar tu solicitud.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-beige">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="animate-pulse">
            <h1 className="text-2xl font-semibold text-club-brown mb-4">Procesando...</h1>
            <p className="text-club-brown/80">Estamos verificando tu solicitud.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-beige">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-club-brown mb-4">Error de autenticación</h1>
          <p className="text-club-brown/80 mb-6">{error || "Ha ocurrido un error al procesar tu solicitud."}</p>
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 bg-club-orange text-white rounded-md hover:bg-club-terracota transition-colors"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-beige">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-club-brown mb-4">Autenticación exitosa</h1>
          <p className="text-club-brown/80">Redirigiendo a la página principal...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
