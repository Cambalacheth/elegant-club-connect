
import { useState, useEffect, useRef } from "react";

const EventsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="events"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-club-brown/90 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-club-black/60 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <span 
            className={`inline-block bg-club-orange/20 text-club-beige px-4 py-1.5 rounded-full text-sm font-medium mb-6 transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Próximo Evento Exclusivo
          </span>
          
          <h2 
            className={`text-3xl md:text-4xl font-semibold text-club-white mb-6 transition-all duration-1000 delay-200 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Cena de Gala: Innovación y Liderazgo
          </h2>
          
          <div 
            className={`transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="bg-club-black/30 px-5 py-3 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-club-beige/80 mb-1">Fecha</p>
                <p className="text-lg text-club-beige font-medium">15 de Diciembre, 2023</p>
              </div>
              
              <div className="bg-club-black/30 px-5 py-3 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-club-beige/80 mb-1">Hora</p>
                <p className="text-lg text-club-beige font-medium">20:00 hs</p>
              </div>
              
              <div className="bg-club-black/30 px-5 py-3 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-club-beige/80 mb-1">Ubicación</p>
                <p className="text-lg text-club-beige font-medium">Palacio Duhau</p>
              </div>
            </div>
          </div>
          
          <p 
            className={`text-lg text-club-beige/90 mb-8 transition-all duration-1000 delay-400 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Una velada exclusiva donde los líderes más destacados compartirán sus visiones sobre el futuro de la innovación, acompañados de una experiencia gastronómica exquisita.
          </p>
          
          <div 
            className={`transition-all duration-1000 delay-500 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <a 
              href="/events" 
              className="inline-block bg-club-orange-mid text-club-white px-8 py-4 rounded-full text-lg font-medium btn-hover-effect"
            >
              Ver Todos los Eventos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
