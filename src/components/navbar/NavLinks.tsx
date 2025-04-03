
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Settings, Globe, FileCode, MailOpen } from "lucide-react";
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
  const [rotatingDomain, setRotatingDomain] = useState<{ name: string; path: string } | null>(null);
  
  // Define fixed links
  const fixedLinks = [
    {
      name: currentLanguage === "en" ? "Domain" : "Dominio",
      path: "/dominio",
      icon: <Globe size={16} />
    },
    {
      name: currentLanguage === "en" ? "Projects" : "Proyectos",
      path: "/projects",
      icon: <FileCode size={16} />
    },
    {
      name: currentLanguage === "en" ? "Forum" : "Foro",
      path: "/forum",
      icon: <MessageSquare size={16} />
    },
  ];

  // Update rotating domain on initial render or when domains change
  useEffect(() => {
    if (domains.length > 0) {
      // Filter domains to exclude those in fixed links and elfotographer
      const availableDomains = domains
        .filter(domain => {
          // Exclude domains that match any fixed link path or elfotographer
          return !fixedLinks.some(link => link.path === domain.path) && 
                 domain.name.toLowerCase() !== "elfotographer";
        })
        .map(domain => ({ name: domain.name, path: domain.path }));
      
      // Add additional domains that might not be in the useDomains hook
      const additionalDomains = [
        { name: currentLanguage === "en" ? "Content" : "Contenido", path: "/content" },
        { name: currentLanguage === "en" ? "Events" : "Eventos", path: "/events" },
        { name: currentLanguage === "en" ? "Members" : "Miembros", path: "/members" },
        { name: currentLanguage === "en" ? "Feedback" : "Opiniones", path: "/feedback" },
        { name: "Asado", path: "/asado" }
      ].filter(domain => !fixedLinks.some(link => link.path === domain.path));
      
      const allDomains = [...availableDomains, ...additionalDomains];
      
      if (allDomains.length > 0) {
        // Pick a random domain from the available ones
        const randomIndex = Math.floor(Math.random() * allDomains.length);
        setRotatingDomain(allDomains[randomIndex]);
      }
    }
  }, [domains, currentLanguage]);

  const feedbackText = currentLanguage === "en" ? "Feedback" : "Opiniones";
  const adminText = currentLanguage === "en" ? "Admin" : "Administración";
  
  const baseClass = isMobile 
    ? "text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300" 
    : "text-club-brown hover:text-club-terracotta transition-colors duration-300";

  const handleClick = isMobile ? onMobileClick : undefined;

  // Helper to get icon based on path
  const getIconForPath = (path: string) => {
    if (path === "/feedback") return <MailOpen size={16} />;
    return null;
  };

  return (
    <>
      {/* Fixed links */}
      {fixedLinks.map((link, index) => (
        <Link 
          key={`fixed-link-${index}`}
          to={link.path}
          className={`${baseClass} flex items-center gap-1`}
          onClick={handleClick}
        >
          {link.icon}
          {link.name}
        </Link>
      ))}
      
      {/* Rotating domain link */}
      {rotatingDomain && (
        <Link 
          to={rotatingDomain.path}
          className={baseClass}
          onClick={handleClick}
        >
          {getIconForPath(rotatingDomain.path)}
          {rotatingDomain.name}
        </Link>
      )}
      
      {/* Admin link - always show if user has admin role */}
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
