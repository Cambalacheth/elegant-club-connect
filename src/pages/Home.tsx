
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowRight, Gavel, Palette, Briefcase, Stethoscope, Users, Cpu } from "lucide-react";
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

  // Texts for verticals section
  const verticalsTitle = language === "en" ? "Our Verticals" : "Nuestras Verticales";
  const verticalsSubtitle = language === "en" 
    ? "Specialized domains for different knowledge areas" 
    : "Dominios especializados para diferentes áreas de conocimiento";

  // Verticals data
  const verticals = [
    {
      name: "Legal",
      path: "/legal",
      icon: <Gavel size={24} className="text-club-terracotta" />,
      description: language === "en" 
        ? "Legal resources, debates and content related to legal aspects" 
        : "Recursos legales, debates y contenido relacionado con aspectos jurídicos"
    },
    {
      name: "Arte",
      path: "/arte",
      icon: <Palette size={24} className="text-club-terracotta" />,
      description: language === "en" 
        ? "Space dedicated to art and entertainment in the community" 
        : "Espacio dedicado al arte y entretenimiento en la comunidad"
    },
    {
      name: "Negocios",
      path: "/negocios",
      icon: <Briefcase size={24} className="text-club-terracotta" />,
      description: language === "en" 
        ? "Resources and debates about entrepreneurship and business" 
        : "Recursos y debates sobre emprendimiento y negocios"
    },
    {
      name: "Salud",
      path: "/salud",
      icon: <Stethoscope size={24} className="text-club-terracotta" />,
      description: language === "en" 
        ? "Content related to wellness and health" 
        : "Contenido relacionado con bienestar y salud"
    },
    {
      name: "Comunidad",
      path: "/comunidad",
      icon: <Users size={24} className="text-club-terracotta" />,
      description: language === "en" 
        ? "The central space for everything related to our community" 
        : "El espacio central para todo lo relacionado con nuestra comunidad"
    },
    {
      name: "Tech",
      path: "/tech",
      icon: <Cpu size={24} className="text-club-terracotta" />,
      description: language === "en" 
        ? "Information and resources about science and technology" 
        : "Información y recursos sobre ciencia y tecnología"
    }
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar currentLanguage={language} />
      <AboutSection />
      <VerticalsSection />
      
      {/* Verticals Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-club-brown mb-4">
              {verticalsTitle}
            </h2>
            <p className="text-lg text-club-brown/80 max-w-2xl mx-auto">
              {verticalsSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {verticals.map((vertical, index) => (
              <Link 
                key={index} 
                to={vertical.path}
                className="bg-club-beige rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 transform hover:scale-105 flex flex-col cursor-pointer"
              >
                <div className="w-14 h-14 bg-club-terracotta/10 rounded-full flex items-center justify-center mb-4">
                  {vertical.icon}
                </div>
                
                <h3 className="text-xl font-serif font-semibold text-club-brown mb-2">
                  {vertical.name}
                </h3>
                
                <p className="text-club-brown/80 mb-4 flex-1">
                  {vertical.description}
                </p>
                
                <div className="flex items-center text-club-orange mt-auto">
                  <span className="mr-2">
                    {language === "en" ? "Explore" : "Explorar"}
                  </span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
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
