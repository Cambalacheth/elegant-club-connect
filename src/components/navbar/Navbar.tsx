
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AuthButton from "./AuthButton";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { useUser } from "@/hooks/useUser";
import SearchBar from "../SearchBar";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = ({ currentLanguage = "es" }: { currentLanguage?: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage: contextLanguage, setCurrentLanguage } = useLanguage();

  // Use provided language prop or fallback to context (for backward compatibility)
  const effectiveLanguage = currentLanguage || contextLanguage || "es";
  
  // Check for language parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setCurrentLanguage(langParam);
    }
  }, [location.search, setCurrentLanguage]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleAuthOrProfile = () => {
    if (user) {
      navigate("/user/me");
    } else {
      navigate("/auth");
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-club-beige/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/home" className="flex items-center">
              <span className="font-bold text-xl text-club-brown">Terreta Hub</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks currentLanguage={effectiveLanguage} userRole={userRole} />
          </nav>
          
          <div className="flex items-center space-x-4">
            <SearchBar currentLanguage={effectiveLanguage} />
            
            <AuthButton 
              currentLanguage={effectiveLanguage}
              user={user}
              userRole={userRole}
              onClick={handleAuthOrProfile}
            />
            
            <button
              onClick={toggleMenu}
              className="md:hidden bg-transparent p-1 rounded-full text-club-terracotta hover:bg-club-beige-dark"
              aria-label={isMenuOpen ? 
                (effectiveLanguage === "en" ? "Close menu" : "Cerrar menú") : 
                (effectiveLanguage === "en" ? "Open menu" : "Abrir menú")
              }
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <MobileMenu 
        isOpen={isMenuOpen} 
        currentLanguage={effectiveLanguage} 
        userRole={userRole} 
        user={user}
        handleAuthOrProfile={handleAuthOrProfile}
        closeMenu={closeMenu}
      />
    </header>
  );
};

export default Navbar;
