
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar";
import LanguageSelection from "../LanguageSelection";
import NavLinks from "./NavLinks";
import AuthButton from "./AuthButton";
import MobileMenu from "./MobileMenu";
import { useNavbarState } from "./useNavbarState";

interface NavbarProps {
  currentLanguage?: string;
}

const Navbar = ({ currentLanguage = "es" }: NavbarProps) => {
  const { 
    isScrolled, 
    mobileMenuOpen, 
    toggleMobileMenu, 
    closeMobileMenu,
    user, 
    userRole, 
    handleAuthOrProfile 
  } = useNavbarState();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-club-beige/90 backdrop-blur-md shadow-md" : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/home" className="flex items-center">
            <span className="font-serif text-2xl font-semibold text-club-brown">
              Terreta Hub
            </span>
          </Link>
          <div className="hidden md:block">
            <SearchBar currentLanguage={currentLanguage} />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks currentLanguage={currentLanguage} userRole={userRole} />
          <div className="flex items-center">
            <LanguageSelection currentLanguage={currentLanguage} />
            <AuthButton 
              currentLanguage={currentLanguage}
              user={user}
              userRole={userRole}
              onClick={handleAuthOrProfile}
            />
          </div>
        </nav>

        <div className="flex items-center md:hidden">
          <div className="mr-2">
            <LanguageSelection currentLanguage={currentLanguage} />
          </div>
          <div className="mr-2">
            <SearchBar currentLanguage={currentLanguage} />
          </div>
          <button 
            className="text-club-brown"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        currentLanguage={currentLanguage}
        userRole={userRole}
        user={user}
        handleAuthOrProfile={handleAuthOrProfile}
        closeMenu={closeMobileMenu}
      />
    </header>
  );
};

export default Navbar;
