
import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordResetFormProps {
  onBackToLogin: () => void;
  onResetEmailSent: (email: string) => void;
}

const PasswordResetForm = ({ onBackToLogin, onResetEmailSent }: PasswordResetFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      onResetEmailSent(email);
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
    <>
      <h1 className="text-3xl font-semibold text-club-brown mb-6 text-center">
        Recuperar contraseña
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

        <Button
          type="submit"
          className="w-full bg-club-orange text-white py-3 rounded-md hover:bg-club-terracota transition-colors disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "Enviar instrucciones"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBackToLogin}
          className="block w-full text-club-olive hover:text-club-terracota transition-colors"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </>
  );
};

export default PasswordResetForm;
