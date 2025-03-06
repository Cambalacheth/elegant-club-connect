
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-club-beige">
      {/* Background Design Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-club-olive rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-club-orange rounded-full opacity-10 blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-club-green rounded-full opacity-15 blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 z-10 pt-24 pb-16 lg:pt-0 lg:pb-0">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="inline-block bg-club-olive/20 text-club-brown px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Club Privado
            </span>
          </div>
          
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-club-brown mb-6 transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Un espacio donde la innovación y el conocimiento se encuentran.
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-club-black/90 mb-10 max-w-2xl mx-auto transition-all duration-1000 delay-500 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Un club privado que conecta líderes en derecho, salud, tecnología, finanzas, arte y comunidad.
          </p>
          
          <div 
            className={`transition-all duration-1000 delay-700 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <a 
              href="#" 
              className="inline-block bg-club-orange text-club-white px-8 py-4 rounded-full text-lg font-medium btn-hover-effect"
            >
              Solicitá tu Invitación
            </a>
          </div>
          
          {/* Scroll Indicator */}
          <div 
            className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-6 h-10 border-2 border-club-brown/40 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-club-brown/40 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
