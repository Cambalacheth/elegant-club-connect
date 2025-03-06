
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Globe, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectionModal = ({ isOpen, onClose }: LanguageSelectionModalProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleLanguageSelect = (language: string) => {
    // In a real app, we would set the language in context/localStorage
    // For now, we'll just navigate to home with a query param
    navigate(`/home?lang=${language}`);
  };

  const handleCustomLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLanguage.trim()) {
      toast({
        title: "Idioma no disponible",
        description: `Lo sentimos, "${customLanguage}" no está configurado todavía. Por favor, elija español o inglés.`,
        variant: "destructive",
      });
      setCustomLanguage("");
      setShowCustomInput(false);
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
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="flex-1 rounded-md border border-club-olive bg-white px-4 py-2 text-club-brown transition hover:bg-club-beige-dark"
              >
                Volver
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md bg-club-orange px-4 py-2 text-white transition hover:bg-club-terracota"
              >
                Enviar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
