
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Globe, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthRedirect?: () => void;
}

const LanguageSelectionModal = ({ isOpen, onClose, onAuthRedirect }: LanguageSelectionModalProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleLanguageSelect = (language: string) => {
    // In a real app, we would set the language in context/localStorage
    // For now, we'll just navigate to home with a query param
    if (onAuthRedirect) {
      // First save the language preference
      localStorage.setItem("preferredLanguage", language);
      // Then redirect to auth
      onAuthRedirect();
    } else {
      navigate(`/home?lang=${language}`);
    }
  };

  const handleCustomLanguageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (customLanguage.trim()) {
      setIsSubmitting(true);
      
      try {
        // Store the custom language request in Supabase
        const { error } = await supabase
          .from('otros_idiomas')
          .insert([{ idioma: customLanguage.trim() }]);
          
        if (error) {
          console.error("Error saving language request:", error);
          throw error;
        }
        
        // Show success toast
        toast({
          title: "Solicitud recibida",
          description: `Gracias por tu interés en "${customLanguage}". Lo tendremos en cuenta para futuras actualizaciones.`,
          variant: "default",
        });
        
        // Reset and close custom input
        setCustomLanguage("");
        setShowCustomInput(false);
        
        // For now, store Spanish as fallback and redirect to auth
        localStorage.setItem("preferredLanguage", "es");
        if (onAuthRedirect) {
          onAuthRedirect();
        } else {
          navigate(`/home?lang=es`);
        }
      } catch (error) {
        // Show error toast
        toast({
          title: "Error al guardar",
          description: "Ha ocurrido un error al guardar tu solicitud. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-club-beige p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-club-brown hover:text-club-terracota"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center justify-center gap-3">
          <Globe className="h-6 w-6 text-club-terracota" />
          <h2 className="text-xl font-semibold text-club-brown">Selecciona un idioma</h2>
        </div>

        {!showCustomInput ? (
          <div className="grid gap-4">
            <button
              onClick={() => handleLanguageSelect("es")}
              className="flex items-center justify-between rounded-md border border-club-olive bg-white p-4 text-left font-medium text-club-brown transition hover:bg-club-beige-dark"
            >
              <span>Español</span>
              <span className="text-sm text-club-brown/70">ES</span>
            </button>
            
            <button
              onClick={() => handleLanguageSelect("en")}
              className="flex items-center justify-between rounded-md border border-club-olive bg-white p-4 text-left font-medium text-club-brown transition hover:bg-club-beige-dark"
            >
              <span>English</span>
              <span className="text-sm text-club-brown/70">EN</span>
            </button>
            
            <button
              onClick={() => setShowCustomInput(true)}
              className="flex items-center justify-between rounded-md border border-club-olive bg-white p-4 text-left font-medium text-club-brown transition hover:bg-club-beige-dark"
            >
              <span>Otro idioma</span>
              <Languages className="h-5 w-5 text-club-olive" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomLanguageSubmit} className="space-y-4">
            <div>
              <label htmlFor="customLanguage" className="mb-2 block text-sm font-medium text-club-brown">
                Escribe el idioma que te interesa:
              </label>
              <input
                type="text"
                id="customLanguage"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                className="w-full rounded-md border border-club-olive bg-white px-4 py-2 focus:border-club-orange focus:outline-none"
                placeholder="Ej: Français, Deutsch, Italiano..."
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="flex-1 rounded-md border border-club-olive bg-white px-4 py-2 text-club-brown transition hover:bg-club-beige-dark"
                disabled={isSubmitting}
              >
                Volver
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md bg-club-orange px-4 py-2 text-white transition hover:bg-club-terracota disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
