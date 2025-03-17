
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Password reset states
  const [isReset, setIsReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      setLoading(true);
      
      // Check if this is a password reset callback
      const reset = searchParams.get("reset") === "true";
      setIsReset(reset);
      
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
          if (!reset) {
            // Regular auth callback
            setSuccess(true);
            
            toast({
              title: "Autenticación exitosa",
              description: "Has iniciado sesión correctamente.",
            });
            
            // Redirect after a brief delay
            setTimeout(() => {
              navigate("/home");
            }, 2000);
          } else {
            // Password reset flow - don't redirect, show password form
            setLoading(false);
          }
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
        if (!isReset) {
          setLoading(false);
        }
      }
    };

    handleAuthCallback();
  }, [navigate, toast, searchParams, isReset]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast({
        title: "Contraseña requerida",
        description: "Por favor, ingresa una nueva contraseña.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error de contraseña",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Contraseña demasiado corta",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        throw error;
      }

      setPasswordUpdated(true);
      
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
      
      // Redirect after a brief delay
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
      
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message);
      toast({
        title: "Error al actualizar contraseña",
        description: err.message || "Ha ocurrido un error al actualizar tu contraseña.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Loading state
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

  // Error state
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

  // Password reset form
  if (isReset && !passwordUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-beige">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-semibold text-club-brown mb-6 text-center">Establece una nueva contraseña</h1>
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-club-brown mb-2">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-club-brown/60" size={18} />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10"
                  placeholder="••••••••"
                  disabled={isResetting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-club-brown/60"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-club-brown mb-2">
                Confirmar nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-club-brown/60" size={18} />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10"
                  placeholder="••••••••"
                  disabled={isResetting}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-club-orange text-white hover:bg-club-terracota"
              disabled={isResetting}
            >
              {isResetting ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Password updated success state
  if (passwordUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-beige">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-club-brown mb-4">Contraseña actualizada</h1>
          <p className="text-club-brown/80 mb-6">Tu contraseña ha sido actualizada correctamente.</p>
          <p className="text-club-brown/80">Redirigiendo a la página de inicio de sesión...</p>
        </div>
      </div>
    );
  }

  // Regular auth success
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
