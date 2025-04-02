
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AuthButton from "./AuthButton";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/types/user";

interface NavbarProps {
  currentLanguage: string;
}

interface NavbarState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  handleAuthOrProfile: () => void;
}

const useNavbarState = (): NavbarState => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAuthOrProfile = () => {
    // Placeholder function, replace with actual logic
    console.log("Auth or Profile button clicked");
  };

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    handleAuthOrProfile,
  };
};

const Navbar = ({ currentLanguage }: { currentLanguage: string }) => {
  const { isMenuOpen, toggleMenu, closeMenu, handleAuthOrProfile } = useNavbarState();
  const { user, userRole } = useUser();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-club-beige/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Terreta Hub Logo" className="h-8" />
              <span className="font-bold text-xl text-club-brown">Terreta Hub</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks currentLanguage={currentLanguage} userRole={userRole} />
          </nav>
          
          <div className="flex items-center space-x-4">
            
            
            <AuthButton 
              currentLanguage={currentLanguage}
              user={user}
              userRole={userRole}
              onClick={handleAuthOrProfile}
            />
            
            <button
              onClick={toggleMenu}
              className="md:hidden bg-transparent p-1 rounded-full text-club-terracotta hover:bg-club-beige-dark"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <MobileMenu 
        isOpen={isMenuOpen} 
        currentLanguage={currentLanguage} 
        userRole={userRole} 
        user={user}
        handleAuthOrProfile={handleAuthOrProfile}
        closeMenu={closeMenu}
      />
    </header>
  );
};

export default Navbar;
