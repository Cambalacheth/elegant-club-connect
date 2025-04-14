
import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
}

const LanguageSelectionModal = ({ isOpen, onClose, currentLanguage }: LanguageSelectionModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectLanguage = (language: string) => {
    localStorage.setItem('preferredLanguage', language);
    navigate(`/auth?lang=${language}`);
  };

  const title = currentLanguage === 'en' ? 'Select Language' : 'Seleccionar Idioma';
  const spanish = currentLanguage === 'en' ? 'Spanish' : 'Español';
  const english = currentLanguage === 'en' ? 'English' : 'Inglés';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-serif text-club-brown">{title}</h2>
          <button onClick={onClose} className="text-club-brown/70 hover:text-club-brown">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <button
            onClick={() => handleSelectLanguage('es')}
            className="w-full py-3 px-4 border border-club-beige-dark rounded-lg flex items-center justify-between hover:bg-club-beige/30 transition-colors"
          >
            <span className="flex items-center">
              <img src="/img/es-flag.png" alt="Spanish flag" className="w-6 h-6 mr-3 rounded-full object-cover" />
              {spanish}
            </span>
            {currentLanguage === 'es' && (
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            )}
          </button>
          
          <button
            onClick={() => handleSelectLanguage('en')}
            className="w-full py-3 px-4 border border-club-beige-dark rounded-lg flex items-center justify-between hover:bg-club-beige/30 transition-colors"
          >
            <span className="flex items-center">
              <img src="/img/en-flag.png" alt="English flag" className="w-6 h-6 mr-3 rounded-full object-cover" />
              {english}
            </span>
            {currentLanguage === 'en' && (
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
