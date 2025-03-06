
import { Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-club-black text-club-beige py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-club-white">Club Exclusivo</h2>
            <p className="text-club-beige/80 max-w-xs">
              Un espacio donde la innovación y el conocimiento se encuentran para forjar conexiones significativas.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-club-terracotta hover:text-club-orange transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-club-terracotta hover:text-club-orange transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-club-terracotta hover:text-club-orange transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-club-white font-medium mb-6 text-lg">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Inicio</a>
              </li>
              <li>
                <a href="#about" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Sobre Nosotros</a>
              </li>
              <li>
                <a href="#verticals" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Verticales</a>
              </li>
              <li>
                <a href="#events" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Eventos</a>
              </li>
            </ul>
          </div>
          
          {/* Verticals */}
          <div>
            <h3 className="text-club-white font-medium mb-6 text-lg">Verticales</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Finanzas</a>
              </li>
              <li>
                <a href="#" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Salud</a>
              </li>
              <li>
                <a href="#" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Derecho</a>
              </li>
              <li>
                <a href="#" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Arte</a>
              </li>
              <li>
                <a href="#" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Comunidad</a>
              </li>
              <li>
                <a href="#" className="text-club-beige/80 hover:text-club-beige transition-colors duration-300">Tecnología</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-club-white font-medium mb-6 text-lg">Contacto</h3>
            <ul className="space-y-3">
              <li className="text-club-beige/80">
                <span className="block text-club-beige mb-1">Dirección</span>
                Av. Libertador 3456, Buenos Aires
              </li>
              <li className="text-club-beige/80">
                <span className="block text-club-beige mb-1">Email</span>
                info@clubexclusivo.com
              </li>
              <li className="text-club-beige/80">
                <span className="block text-club-beige mb-1">Teléfono</span>
                +54 11 5678 9012
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-club-brown/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-club-beige/60 text-sm">
            © {new Date().getFullYear()} Club Exclusivo. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-club-beige/60 hover:text-club-beige text-sm transition-colors duration-300">
              Política de Privacidad
            </a>
            <a href="#" className="text-club-beige/60 hover:text-club-beige text-sm transition-colors duration-300">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
