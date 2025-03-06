
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            Sobre Nosotros
          </a>
          <a href="#verticals" className="text-club-brown hover:text-club-terracotta transition-colors duration-300">
            Verticales
          </a>
          <a href="#events" className="text-club-brown hover:text-club-terracotta transition-colors duration-300">
            Eventos
          </a>
          <a 
            href="#" 
            className="bg-club-orange text-club-white px-6 py-2.5 rounded-full btn-hover-effect"
          >
            Ingresar al Club
          </a>
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
              Sobre Nosotros
            </a>
            <a 
              href="#verticals" 
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Verticales
            </a>
            <a 
              href="#events" 
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Eventos
            </a>
            <a 
              href="#" 
              className="bg-club-orange text-club-white px-6 py-2.5 rounded-full inline-block text-center btn-hover-effect"
            >
              Ingresar al Club
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
