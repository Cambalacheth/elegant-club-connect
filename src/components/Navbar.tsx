
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface NavbarProps {
  currentLanguage?: string;
}

const Navbar = ({ currentLanguage = "es" }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check for authenticated user
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle auth or profile navigation
  const handleAuthOrProfile = () => {
    if (user) {
      // If logged in, go to profile using /me path
      navigate('/user/me');
    } else {
      // If not logged in, go to auth page
      navigate('/auth');
    }
  };

  // Determine text based on language
  const aboutText = currentLanguage === "en" ? "About Us" : "Sobre Nosotros";
  const verticalsText = currentLanguage === "en" ? "Verticals" : "Verticales";
  const eventsText = currentLanguage === "en" ? "Events" : "Eventos";
  const projectsText = currentLanguage === "en" ? "Projects" : "Proyectos";
  const enterClubText = currentLanguage === "en" 
    ? (user ? "My Profile" : "Enter the Club") 
    : (user ? "Mi Perfil" : "Ingresar al Club");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-club-beige/90 backdrop-blur-md shadow-md" : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <span className="font-serif text-2xl font-semibold text-club-brown">
            Club Exclusivo
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#about" className="text-club-brown hover:text-club-terracotta transition-colors duration-300">
            {aboutText}
          </a>
          <a href="#verticals" className="text-club-brown hover:text-club-terracotta transition-colors duration-300">
            {verticalsText}
          </a>
          <a href="#events" className="text-club-brown hover:text-club-terracotta transition-colors duration-300">
            {eventsText}
          </a>
          <Link 
            to={`/projects?lang=${currentLanguage}`}
            className="text-club-brown hover:text-club-terracotta transition-colors duration-300"
          >
            {projectsText}
          </Link>
          <button 
            onClick={handleAuthOrProfile}
            className="bg-club-orange text-club-white px-6 py-2.5 rounded-full btn-hover-effect flex items-center gap-2"
          >
            {enterClubText}
            {user && <User size={16} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-club-brown"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-club-beige/95 backdrop-blur-md shadow-lg py-4 animate-fade-in">
          <nav className="flex flex-col space-y-4 px-6">
            <a 
              href="#about" 
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {aboutText}
            </a>
            <a 
              href="#verticals" 
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {verticalsText}
            </a>
            <a 
              href="#events" 
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {eventsText}
            </a>
            <Link 
              to={`/projects?lang=${currentLanguage}`}
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {projectsText}
            </Link>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                handleAuthOrProfile();
              }}
              className="bg-club-orange text-club-white px-6 py-2.5 rounded-full inline-block text-center btn-hover-effect flex items-center gap-2 justify-center"
            >
              {enterClubText}
              {user && <User size={16} />}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
