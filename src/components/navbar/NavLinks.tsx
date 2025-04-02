import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Settings, Globe } from "lucide-react";
import { UserRole, canAdminContent } from "@/types/user";
import { useDomains } from "@/hooks/useDomains";

interface NavLinksProps {
  currentLanguage: string;
  userRole: UserRole;
  isMobile?: boolean;
  onMobileClick?: () => void;
}

const NavLinks = ({ currentLanguage, userRole, isMobile = false, onMobileClick = () => {} }: NavLinksProps) => {
  const { domains } = useDomains();
  const [randomDomains, setRandomDomains] = useState<Array<{ name: string; path: string }>>([]);
  
  // Update random domains on initial render or when domains change
  useEffect(() => {
    if (domains.length > 0) {
      // Filter out elfotographer and filter to all available domains that could be shown
      const availableDomains = domains
        .filter(domain => domain.name.toLowerCase() !== "elfotographer")
        .map(domain => ({ name: domain.name, path: domain.path }));
      
      // Add additional domains that might not be in the useDomains hook
      const additionalDomains = [
        { name: "Proyectos", path: "/projects" },
        { name: "Contenido", path: "/content" },
        { name: "Eventos", path: "/events" },
        { name: "Miembros", path: "/members" },
        { name: "Foro", path: "/forum" },
        { name: "Asado", path: "/asado" }
      ];
      
      const allDomains = [...availableDomains, ...additionalDomains];
      
      // Shuffle and pick 3 random domains
      const shuffled = [...allDomains].sort(() => 0.5 - Math.random());
      setRandomDomains(shuffled.slice(0, 3));
    }
  }, [domains]);

  const projectsText = currentLanguage === "en" ? "Projects" : "Proyectos";
  const membersText = currentLanguage === "en" ? "Members" : "Miembros";
  const forumText = currentLanguage === "en" ? "Forum" : "Foro";
  const contentText = currentLanguage === "en" ? "Content" : "Contenido";
  const eventsText = currentLanguage === "en" ? "Events" : "Eventos";
  const adminText = currentLanguage === "en" ? "Admin" : "Administración";
  const feedbackText = currentLanguage === "en" ? "Feedback" : "Opiniones";
  const dominioText = currentLanguage === "en" ? "Domain" : "Dominio";
  
  const baseClass = isMobile 
    ? "text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300" 
    : "text-club-brown hover:text-club-terracotta transition-colors duration-300";

  const handleClick = isMobile ? onMobileClick : undefined;

  // Helper to get the display name based on path
  const getDisplayName = (path: string, name: string): string => {
    switch (path) {
      case '/projects': return projectsText;
      case '/members': return membersText;
      case '/forum': return forumText;
      case '/content': return contentText;
      case '/events': return eventsText;
      case '/asado': return "Asado";
      default: return name;
    }
  };

  return (
    <>
      {/* Dominio link (always first) */}
      <Link 
        to="/dominio"
        className={`${baseClass} flex items-center gap-1`}
        onClick={handleClick}
      >
        <Globe size={16} />
        {dominioText}
      </Link>
      
      {/* Three random domains */}
      {randomDomains.map((domain, index) => (
        <Link 
          key={`domain-${index}`}
          to={domain.path}
          className={baseClass}
          onClick={handleClick}
        >
          {getDisplayName(domain.path, domain.name)}
        </Link>
      ))}
      
      {/* Feedback link - keep it as it was */}
      <Link 
        to="/feedback"
        className={`${baseClass} flex items-center gap-1`}
        onClick={handleClick}
      >
        <MessageSquare size={16} />
        {feedbackText}
      </Link>
      
      {/* Admin link - keep it as it was */}
      {canAdminContent(userRole) && (
        <Link 
          to="/admin"
          className={`${baseClass} flex items-center gap-1`}
          onClick={handleClick}
        >
          <Settings size={16} />
          {adminText}
        </Link>
      )}
    </>
  );
};

export default NavLinks;
