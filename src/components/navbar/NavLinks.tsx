
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Settings, Globe, FileCode, Gavel, Palette, Briefcase, Stethoscope, Users, Cpu, ChevronDown } from "lucide-react";
import { UserLevel, UserRole, canAdminContent } from "@/types/user";
import { useDomains } from "@/hooks/useDomains";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  currentLanguage: string;
  userRole: UserRole;
  isMobile?: boolean;
  onMobileClick?: () => void;
}

// Define vertical paths we'll always want to show
const VERTICAL_PATHS = ['/legal', '/arte', '/negocios', '/salud', '/comunidad', '/tech'];

const NavLinks = ({ currentLanguage, userRole, isMobile = false, onMobileClick = () => {} }: NavLinksProps) => {
  const { domains } = useDomains({ prioritizePaths: VERTICAL_PATHS });
  const [rotatingDomain, setRotatingDomain] = useState<{ name: string; path: string } | null>(null);
  
  // Filter domains for verticals
  const verticalDomains = domains.filter(domain => 
    VERTICAL_PATHS.includes(domain.path)
  );
  
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

  // Update rotating domain on initial render or when domains change
  useEffect(() => {
    if (domains.length > 0) {
      // Filter domains to exclude those in fixed links, verticals, and elfotographer
      const availableDomains = domains
        .filter(domain => {
          // Exclude domains that match any fixed link path, vertical path, or elfotographer
          return !fixedLinks.some(link => link.path === domain.path) && 
                 !VERTICAL_PATHS.includes(domain.path) &&
                 domain.name.toLowerCase() !== "elfotographer";
        })
        .map(domain => ({ name: domain.name, path: domain.path }));
      
      // Add additional domains that might not be in the useDomains hook
      const additionalDomains = [
        { name: currentLanguage === "en" ? "Content" : "Contenido", path: "/content" },
        { name: currentLanguage === "en" ? "Events" : "Eventos", path: "/events" },
        { name: currentLanguage === "en" ? "Members" : "Miembros", path: "/members" },
        { name: currentLanguage === "en" ? "Feedback" : "Opiniones", path: "/feedback" },
        { name: "Asado", path: "/asado" },
        { name: currentLanguage === "en" ? "Vote" : "Votación", path: "/vote" }
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
  const verticalesText = currentLanguage === "en" ? "Verticals" : "Verticales";
  
  const baseClass = isMobile 
    ? "text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300" 
    : "text-club-brown hover:text-club-terracotta transition-colors duration-300";

  const handleClick = isMobile ? onMobileClick : undefined;

  // Helper to get icon based on path
  const getIconForPath = (path: string) => {
    if (path === "/feedback") return <Gavel size={16} />;
    if (path === "/legal") return <Gavel size={16} />;
    if (path === "/arte") return <Palette size={16} />;
    if (path === "/negocios") return <Briefcase size={16} />;
    if (path === "/salud") return <Stethoscope size={16} />;
    if (path === "/comunidad") return <Users size={16} />;
    if (path === "/tech") return <Cpu size={16} />;
    return null;
  };

  // Verticals dropdown for desktop
  const VerticalsDropdown = () => {
    if (isMobile) return null;
    
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-club-beige-dark text-club-brown hover:text-club-terracotta px-0">
              <span className="flex items-center gap-1">
                {verticalesText}
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[220px] gap-2 p-2 bg-club-beige">
                {verticalDomains.map((domain, index) => (
                  <li key={index}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={domain.path}
                        className="flex items-center gap-2 px-3 py-2 text-club-brown hover:text-club-terracotta hover:bg-club-beige-dark rounded-md"
                        onClick={handleClick}
                      >
                        {getIconForPath(domain.path)}
                        {domain.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  };

  // Mobile vertical links display
  const MobileVerticalLinks = () => {
    if (!isMobile) return null;
    
    return (
      <div className="mb-2">
        <div className="font-medium text-club-terracotta mb-1">{verticalesText}</div>
        <div className="ml-2 flex flex-col gap-1">
          {verticalDomains.map((domain, index) => (
            <Link 
              key={`mobile-vertical-${index}`}
              to={domain.path}
              className={`${baseClass} flex items-center gap-1`}
              onClick={handleClick}
            >
              {getIconForPath(domain.path)}
              {domain.name}
            </Link>
          ))}
        </div>
      </div>
    );
  };

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
      {isMobile ? <MobileVerticalLinks /> : <VerticalsDropdown />}
      
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
