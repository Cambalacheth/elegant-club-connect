
import { useState, useEffect, useRef } from "react";

const AboutSection = () => {
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
      id="about"
      ref={sectionRef}
      className="py-20 bg-club-green relative overflow-hidden"
    >
      {/* Background Design Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-club-olive rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-club-beige rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Image */}
            <div 
              className={`transition-all duration-1000 transform ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-club-terracotta rounded-2xl transform rotate-3 scale-105 -z-10"></div>
                <div className="bg-club-beige p-4 rounded-2xl shadow-lg">
                  <div className="aspect-w-4 aspect-h-5 overflow-hidden rounded-lg">
                    <div className="w-full h-full bg-club-olive/20 flex items-center justify-center">
                      {/* This would be an image in a real implementation */}
                      <div className="text-club-olive p-8 text-center">
                        <div className="w-16 h-16 mx-auto border-2 border-club-olive/70 rounded-full flex items-center justify-center mb-4">
                          <div className="w-10 h-10 bg-club-olive/70 rounded-full"></div>
                        </div>
                        <p className="font-serif">Imagen del Club</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Text */}
            <div>
              <span 
                className={`inline-block bg-club-olive/30 text-club-brown px-4 py-1.5 rounded-full text-sm font-medium mb-6 transition-all duration-1000 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Sobre el Club
              </span>
              
              <h2 
                className={`text-3xl md:text-4xl font-semibold text-club-brown mb-6 transition-all duration-1000 delay-200 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Una comunidad exclusiva de líderes e innovadores
              </h2>
              
              <p 
                className={`text-lg text-club-brown/90 mb-6 transition-all duration-1000 delay-300 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Fundado con la visión de unir a personas extraordinarias, nuestro club ofrece un entorno donde el intercambio de ideas trasciende los límites convencionales.
              </p>
              
              <p 
                className={`text-lg text-club-brown/90 mb-8 transition-all duration-1000 delay-400 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Aquí, el conocimiento y la experiencia de diferentes ámbitos convergen para crear oportunidades únicas, colaboraciones inesperadas y amistades duraderas.
              </p>
              
              <div 
                className={`transition-all duration-1000 delay-500 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <a 
                  href="#verticals" 
                  className="inline-flex items-center font-medium text-club-terracotta hover:text-club-brown transition-colors duration-300"
                >
                  Descubre nuestras verticales
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
