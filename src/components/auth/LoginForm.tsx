
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onToggleMode, onForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    
    if (!password) {
      toast({
        title: "Contraseña requerida",
        description: "Por favor, ingresa tu contraseña.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a Terreta Hub.",
      });
      navigate("/home");
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

  return (
    <>
      <h1 className="text-3xl font-semibold text-club-brown mb-6 text-center">
        Ingresar al Club
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-club-brown mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-club-brown/60" size={18} />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4"
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-club-brown mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-club-brown/60" size={18} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10"
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

        <Button
          type="submit"
          className="w-full bg-club-orange text-white py-3 rounded-md hover:bg-club-terracota transition-colors disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "Ingresar"}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <button
          onClick={onForgotPassword}
          className="text-club-olive hover:text-club-terracota transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
        
        <button
          onClick={onToggleMode}
          className="text-club-olive hover:text-club-terracota transition-colors"
        >
          ¿No tienes una cuenta? Crear cuenta
        </button>
      </div>
    </>
  );
};

export default LoginForm;
