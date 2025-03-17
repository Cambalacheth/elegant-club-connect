
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor, ingresa tu correo electrónico.",
        variant: "destructive",
      });
      return;
    }

    // If in forgot password mode, handle password reset
    if (isForgotPassword) {
      return handlePasswordReset();
    }
    
    if (!password) {
      toast({
        title: "Contraseña requerida",
        description: "Por favor, ingresa tu contraseña.",
        variant: "destructive",
      });
      return;
    }

    // For registration, validate password confirmation
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Error de contraseña",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // On successful login
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido a Terreta Hub.",
        });
        navigate("/home");
      } else {
        // Handle registration
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        
        // On successful registration
        toast({
          title: "Registro exitoso",
          description: "Por favor, revisa tu correo electrónico para confirmar tu cuenta.",
        });
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Error de autenticación",
        description: error.message || "Ha ocurrido un error durante la autenticación.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor, ingresa tu correo electrónico para restablecer la contraseña.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?reset=true`,
      });

      if (error) throw error;
      
      setResetEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Hemos enviado un correo con instrucciones para restablecer tu contraseña.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error al restablecer contraseña",
        description: error.message || "Ha ocurrido un error al intentar restablecer tu contraseña.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-club-beige">
      <div className="container mx-auto px-6 py-16">
        <button 
          onClick={() => navigate("/")}
          className="mb-8 flex items-center text-club-brown hover:text-club-terracota transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver
        </button>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-semibold text-club-brown mb-6 text-center">
            {isForgotPassword ? "Recuperar contraseña" : isLogin ? "Ingresar al Club" : "Crear cuenta"}
          </h1>

          {resetEmailSent ? (
            <div className="text-center">
              <p className="text-club-brown mb-6">
                Hemos enviado un correo electrónico a <strong>{email}</strong> con instrucciones para restablecer tu contraseña.
              </p>
              <p className="text-club-brown mb-6">
                Por favor revisa tu bandeja de entrada y sigue las instrucciones en el correo.
              </p>
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetEmailSent(false);
                  setIsLogin(true);
                }}
                className="text-club-olive hover:text-club-terracota transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-club-brown mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-club-brown/60" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-club-olive rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange"
                    placeholder="ejemplo@correo.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-club-brown mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-club-brown/60" size={18} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-club-olive rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange"
                      placeholder="••••••••"
                      disabled={isLoading}
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
              )}

              {!isLogin && !isForgotPassword && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-club-brown mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-club-brown/60" size={18} />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-club-olive rounded-md focus:outline-none focus:ring-2 focus:ring-club-orange"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-club-orange text-white py-3 rounded-md hover:bg-club-terracota transition-colors disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading 
                  ? "Procesando..." 
                  : isForgotPassword 
                    ? "Enviar instrucciones" 
                    : isLogin 
                      ? "Ingresar" 
                      : "Crear cuenta"
                }
              </button>
            </form>
          )}

          {!resetEmailSent && (
            <div className="mt-6 text-center space-y-3">
              {isLogin && !isForgotPassword && (
                <button
                  onClick={() => setIsForgotPassword(true)}
                  className="text-club-olive hover:text-club-terracota transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
              
              {isForgotPassword ? (
                <button
                  onClick={() => setIsForgotPassword(false)}
                  className="block w-full text-club-olive hover:text-club-terracota transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-club-olive hover:text-club-terracota transition-colors"
                >
                  {isLogin ? "¿No tienes una cuenta? Crear cuenta" : "¿Ya tienes una cuenta? Ingresar"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
