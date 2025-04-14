
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Globe, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
}

const LanguageSelectionModal = ({ isOpen, onClose, currentLanguage = "es" }: LanguageSelectionModalProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isOpen) return null;

  // Texts based on current language
  const selectLanguageText = currentLanguage === "en" ? "Select a language" : "Selecciona un idioma";
  const otherLanguageText = currentLanguage === "en" ? "Other language" : "Otro idioma";
  const writeLanguageText = currentLanguage === "en" 
    ? "Write the language you're interested in:" 
    : "Escribe el idioma que te interesa:";
  const placeholderText = currentLanguage === "en" 
    ? "E.g: Français, Deutsch, Italiano..." 
    : "Ej: Français, Deutsch, Italiano...";
  const backText = currentLanguage === "en" ? "Back" : "Volver";
  const sendText = currentLanguage === "en" ? "Send" : "Enviar";
  const sendingText = currentLanguage === "en" ? "Sending..." : "Enviando...";
  const requestReceivedText = currentLanguage === "en" ? "Request received" : "Solicitud recibida";
  const thankYouText = currentLanguage === "en" 
    ? `Thank you for your interest in "${customLanguage}". We'll consider it for future updates.` 
    : `Gracias por tu interés en "${customLanguage}". Lo tendremos en cuenta para futuras actualizaciones.`;
  const errorSavingText = currentLanguage === "en" 
    ? "Error saving" 
    : "Error al guardar";
  const errorDescriptionText = currentLanguage === "en" 
    ? "An error occurred while saving your request. Please try again." 
    : "Ha ocurrido un error al guardar tu solicitud. Por favor, inténtalo de nuevo.";

  const handleLanguageSelect = (language: string) => {
    // Save the language preference
    localStorage.setItem("preferredLanguage", language);
    // Navigate directly to home page
    navigate(`/home?lang=${language}`);
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
          title: requestReceivedText,
          description: thankYouText,
          variant: "default",
        });
        
        // Reset and close custom input
        setCustomLanguage("");
        setShowCustomInput(false);
        
        // For now, store Spanish as fallback and navigate to home
        localStorage.setItem("preferredLanguage", "es");
        navigate(`/home?lang=es`);
      } catch (error) {
        // Show error toast
        toast({
          title: errorSavingText,
          description: errorDescriptionText,
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
          <h2 className="text-xl font-semibold text-club-brown">{selectLanguageText}</h2>
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
              <span>{otherLanguageText}</span>
              <Languages className="h-5 w-5 text-club-olive" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomLanguageSubmit} className="space-y-4">
            <div>
              <label htmlFor="customLanguage" className="mb-2 block text-sm font-medium text-club-brown">
                {writeLanguageText}
              </label>
              <input
                type="text"
                id="customLanguage"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                className="w-full rounded-md border border-club-olive bg-white px-4 py-2 focus:border-club-orange focus:outline-none"
                placeholder={placeholderText}
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
                {backText}
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md bg-club-orange px-4 py-2 text-white transition hover:bg-club-terracota disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? sendingText : sendText}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
