
import { Link } from "react-router-dom";
import { MessageSquare, Settings, Globe, FileCode } from "lucide-react";
import { UserRole, canAdminContent } from "@/types/user";
import { VerticalsDropdown } from "./VerticalsDropdown";
import { MobileVerticalLinks } from "./MobileVerticalLinks";
import { useRotatingDomain } from "@/hooks/useRotatingDomain";

interface NavLinksProps {
  currentLanguage: string;
  userRole: UserRole;
  isMobile?: boolean;
  onMobileClick?: () => void;
}

const NavLinks = ({ currentLanguage, userRole, isMobile = false, onMobileClick = () => {} }: NavLinksProps) => {
  // Define fixed links - IMPORTANT: Order as specified by the user
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
  
  const fixedPaths = fixedLinks.map(link => link.path);
  
  // Get a rotating domain
  const rotatingDomain = useRotatingDomain({ 
    currentLanguage, 
    fixedPaths 
  });

  const adminText = currentLanguage === "en" ? "Admin" : "Administración";
  
  const baseClass = isMobile 
    ? "text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300" 
    : "text-club-brown hover:text-club-terracotta transition-colors duration-300";

  const handleClick = isMobile ? onMobileClick : undefined;

  return (
    <>
      {/* Fixed links first (in the exact order requested) */}
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
      
      {/* Verticals dropdown (desktop) or header (mobile) */}
      {isMobile ? (
        <MobileVerticalLinks 
          currentLanguage={currentLanguage} 
          handleClick={handleClick}
          baseClass={baseClass} 
        />
      ) : (
        <VerticalsDropdown 
          currentLanguage={currentLanguage} 
          handleClick={handleClick} 
        />
      )}
      
      {/* Rotating domain link */}
      {rotatingDomain && (
        <Link 
          to={rotatingDomain.path}
          className={baseClass}
          onClick={handleClick}
        >
          {rotatingDomain.name}
        </Link>
      )}
      
      {/* Admin link - always shown if user has admin privileges */}
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
