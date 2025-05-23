
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "../components/HeroSection";
import LanguageSelectionModal from "../components/LanguageSelectionModal";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { currentLanguage, setCurrentLanguage } = useLanguage();

  useEffect(() => {
    // Check if user just logged in (presence of success message in URL)
    const hasSuccessParam = window.location.href.includes('success=true');
    
    // Check current auth state
    const checkAuthState = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session && hasSuccessParam) {
        setShowSuccessMessage(true);
        // Hide the message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
          // Remove the success parameter from the URL
          const newUrl = window.location.href.replace('?success=true', '').replace('&success=true', '');
          window.history.replaceState({}, document.title, newUrl);
        }, 3000);
      }
    };
    
    checkAuthState();
    
    // On initial render, check if we're at the root path
    if (window.location.pathname === '/') {
      // Smooth scroll functionality for anchor links
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A') {
          const href = target.getAttribute('href');
          if (href && href.startsWith('#') && href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        }
      };

      document.addEventListener('click', handleAnchorClick);
      return () => document.removeEventListener('click', handleAnchorClick);
    } else {
      // If we're explicitly at /Index (not just root), redirect to /home
      if (window.location.pathname === '/Index') {
        navigate('/home');
      }
    }
  }, [navigate]);

  const handleIngresarClick = () => {
    setShowLanguageModal(true);
  };

  // Success message text based on language
  const successTitle = currentLanguage === "en" ? "Login successful" : "Inicio de sesión exitoso";
  const welcomeText = currentLanguage === "en" ? "Welcome to Terreta Hub" : "Bienvenido a Terreta Hub";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection handleIngresar={handleIngresarClick} language={currentLanguage} />
      
      {/* Language selection modal */}
      <LanguageSelectionModal 
        isOpen={showLanguageModal} 
        onClose={() => setShowLanguageModal(false)} 
        currentLanguage={currentLanguage}
      />
      
      {/* Login success message */}
      {showSuccessMessage && (
        <div className="fixed bottom-5 right-5 bg-white rounded-lg shadow-md p-4 z-50 border-l-4 border-green-500 max-w-xs">
          <h3 className="font-medium text-green-800">{successTitle}</h3>
          <p className="text-sm text-gray-600">{welcomeText}</p>
        </div>
      )}
    </main>
  );
};

export default Index;
