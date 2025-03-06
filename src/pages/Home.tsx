
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import VerticalsSection from "../components/VerticalsSection";

const Home = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish

  useEffect(() => {
    // Extract language from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
      console.log(`Language set to: ${langParam}`);
    }
  }, [location]);

  // Text based on selected language
  const exploreForumText = language === "en" 
    ? "Explore our Forum" 
    : "Explora nuestro Foro";
  const exploreCommunityProjectsText = language === "en" 
    ? "See Community Projects" 
    : "Ver Proyectos de la Comunidad";
  const exploreContentText = language === "en" 
    ? "Discover our Content" 
    : "Descubre nuestro Contenido";
  const exploreEventsText = language === "en" 
    ? "Check Upcoming Events" 
    : "Ver Próximos Eventos";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar currentLanguage={language} />
      <AboutSection />
      <VerticalsSection />
      
      {/* Call-to-action section */}
      <section className="py-20 bg-club-beige/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/forum" className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow hover:scale-105 transform transition-transform">
              <h3 className="text-2xl font-serif text-club-brown mb-4">{exploreForumText}</h3>
              <p className="text-club-brown/80 mb-6">
                {language === "en" 
                  ? "Join discussions with our community members." 
                  : "Únete a las discusiones con los miembros de nuestra comunidad."}
              </p>
              <div className="flex items-center text-club-orange">
                <span className="mr-2">{language === "en" ? "Go to Forum" : "Ir al Foro"}</span>
                <ArrowRight size={16} />
              </div>
            </Link>
            
            <Link to="/projects" className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow hover:scale-105 transform transition-transform">
              <h3 className="text-2xl font-serif text-club-brown mb-4">{exploreCommunityProjectsText}</h3>
              <p className="text-club-brown/80 mb-6">
                {language === "en" 
                  ? "Discover amazing projects from our community." 
                  : "Descubre increíbles proyectos de nuestra comunidad."}
              </p>
              <div className="flex items-center text-club-orange">
                <span className="mr-2">{language === "en" ? "See Projects" : "Ver Proyectos"}</span>
                <ArrowRight size={16} />
              </div>
            </Link>
            
            <Link to="/content" className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow hover:scale-105 transform transition-transform">
              <h3 className="text-2xl font-serif text-club-brown mb-4">{exploreContentText}</h3>
              <p className="text-club-brown/80 mb-6">
                {language === "en" 
                  ? "Articles, videos and resources for our community." 
                  : "Artículos, videos y recursos para nuestra comunidad."}
              </p>
              <div className="flex items-center text-club-orange">
                <span className="mr-2">{language === "en" ? "See Content" : "Ver Contenido"}</span>
                <ArrowRight size={16} />
              </div>
            </Link>
            
            <Link to="/events" className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow hover:scale-105 transform transition-transform">
              <h3 className="text-2xl font-serif text-club-brown mb-4">{exploreEventsText}</h3>
              <p className="text-club-brown/80 mb-6">
                {language === "en" 
                  ? "Stay updated with our upcoming events." 
                  : "Mantente al día con nuestros próximos eventos."}
              </p>
              <div className="flex items-center text-club-orange">
                <span className="mr-2">{language === "en" ? "See Events" : "Ver Eventos"}</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
