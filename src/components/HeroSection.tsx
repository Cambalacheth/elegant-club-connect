
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  handleIngresar?: () => void;
  language?: string;
}

const HeroSection = ({ handleIngresar, language = "es" }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleIngresarClick = () => {
    if (handleIngresar) {
      handleIngresar();
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/9c3ab4d8-6b49-416f-af3d-5fd353772b66.png" 
          alt="Terreta Hub Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div> {/* Overlay for better text readability */}
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 z-10 pt-24 pb-16 lg:pt-0 lg:pb-0 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight text-white mb-10">
              Terreta Hub
            </h1>
          </div>
          
          <div 
            className={`transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <button 
              onClick={handleIngresarClick}
              className="inline-flex items-center gap-2 bg-club-orange text-club-white px-8 py-4 rounded-full text-lg font-medium btn-hover-effect hover:bg-club-terracota transition-colors"
            >
              {language === "en" ? "Enter" : "Ingresar"}
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div 
            className={`transition-all duration-1000 delay-500 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-xl md:text-2xl text-white/90 mt-10 max-w-2xl mx-auto">
              {language === "en" ? "Builders Club in Valencia" : "Builders Club en Valencia"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
