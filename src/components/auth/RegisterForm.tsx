
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "./InfoIcon";

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    if (password !== confirmPassword) {
      toast({
        title: "Error de contraseña",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;
      
      toast({
        title: "Registro exitoso",
        description: "Hemos enviado un correo de verificación a tu dirección de email. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.",
      });
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
        Crear cuenta
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-club-brown mb-2">
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-club-brown/60" size={18} />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-club-orange text-white py-3 rounded-md hover:bg-club-terracota transition-colors disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "Crear cuenta"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onToggleMode}
          className="text-club-olive hover:text-club-terracota transition-colors"
        >
          ¿Ya tienes una cuenta? Ingresar
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <InfoIcon className="inline-block mr-2 h-4 w-4" />
          Al registrarte, recibirás un email de verificación. Deberás verificar tu cuenta antes de poder iniciar sesión.
        </p>
      </div>
    </>
  );
};

export default RegisterForm;
