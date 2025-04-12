
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getVerticalInfo } from "./VerticalDomainHeader";

interface VerticalDomainContentProps {
  currentPath: string;
  currentLanguage: string;
}

const VerticalDomainContent = ({ currentPath, currentLanguage }: VerticalDomainContentProps) => {
  const info = getVerticalInfo(currentPath, currentLanguage);
  
  // Textos multilingües
  const texts = {
    aboutTitle: currentLanguage === "en" ? "About this vertical" : "Acerca de esta vertical",
    aboutDescription: currentLanguage === "en" 
      ? "This vertical brings together experts, resources and projects in the field."
      : "Esta vertical reúne expertos, recursos y proyectos en este campo.",
    resourcesTitle: currentLanguage === "en" ? "Resources" : "Recursos",
    resourcesDescription: currentLanguage === "en"
      ? "Explore resources related to this vertical."
      : "Explora recursos relacionados con esta vertical.",
    resourcesLink: currentLanguage === "en" ? "View all resources" : "Ver todos los recursos",
    eventsTitle: currentLanguage === "en" ? "Events" : "Eventos",
    eventsDescription: currentLanguage === "en"
      ? "Don't miss upcoming events in this area."
      : "No te pierdas los próximos eventos en esta área.",
    eventsLink: currentLanguage === "en" ? "View all events" : "Ver todos los eventos",
    domainsTitle: currentLanguage === "en" ? "Related domains" : "Dominios relacionados",
    domainsDescription: currentLanguage === "en"
      ? "Discover related domains in our ecosystem."
      : "Descubre dominios relacionados en nuestro ecosistema.",
    domainsLink: currentLanguage === "en" ? "Explore domains" : "Explorar dominios",
  };
  
  return (
    <div className="py-12 bg-club-beige/20">
      <div className="container mx-auto px-4">
        {/* Sección Acerca de */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-club-brown mb-4">{texts.aboutTitle}</h2>
          <p className="text-club-brown/80 max-w-3xl mb-6">{texts.aboutDescription}</p>
          <p className="text-club-brown/80 max-w-3xl">
            {currentLanguage === "en" 
              ? `In the ${info.title} vertical, we explore the challenges and opportunities that this field presents. Our community of experts shares insights, resources and experiences.`
              : `En la vertical de ${info.title}, exploramos los desafíos y oportunidades que presenta este campo. Nuestra comunidad de expertos comparte conocimientos, recursos y experiencias.`}
          </p>
        </section>
        
        {/* Sección de cajas de información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recursos */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-club-brown mb-3">{texts.resourcesTitle}</h3>
            <p className="text-club-brown/70 mb-6">{texts.resourcesDescription}</p>
            <Link 
              to="/recursos" 
              className="inline-flex items-center text-club-terracotta hover:text-club-terracotta/80 transition-colors"
            >
              {texts.resourcesLink}
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {/* Eventos */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-club-brown mb-3">{texts.eventsTitle}</h3>
            <p className="text-club-brown/70 mb-6">{texts.eventsDescription}</p>
            <Link 
              to="/events" 
              className="inline-flex items-center text-club-terracotta hover:text-club-terracotta/80 transition-colors"
            >
              {texts.eventsLink}
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {/* Dominios */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-club-brown mb-3">{texts.domainsTitle}</h3>
            <p className="text-club-brown/70 mb-6">{texts.domainsDescription}</p>
            <Link 
              to="/dominio" 
              className="inline-flex items-center text-club-terracotta hover:text-club-terracotta/80 transition-colors"
            >
              {texts.domainsLink}
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalDomainContent;
