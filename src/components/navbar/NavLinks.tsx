
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { UserRole, canAdminContent } from "@/types/user";

interface NavLinksProps {
  currentLanguage: string;
  userRole: UserRole;
  isMobile?: boolean;
  onMobileClick?: () => void;
}

const NavLinks = ({ currentLanguage, userRole, isMobile = false, onMobileClick = () => {} }: NavLinksProps) => {
  const projectsText = currentLanguage === "en" ? "Projects" : "Proyectos";
  const membersText = currentLanguage === "en" ? "Members" : "Miembros";
  const forumText = currentLanguage === "en" ? "Forum" : "Foro";
  const contentText = currentLanguage === "en" ? "Content" : "Contenido";
  const eventsText = currentLanguage === "en" ? "Events" : "Eventos";
  const adminText = currentLanguage === "en" ? "Admin" : "Administración";
  
  const baseClass = isMobile 
    ? "text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300" 
    : "text-club-brown hover:text-club-terracotta transition-colors duration-300";

  const handleClick = isMobile ? onMobileClick : undefined;

  return (
    <>
      <Link 
        to="/projects"
        className={baseClass}
        onClick={handleClick}
      >
        {projectsText}
      </Link>
      <Link 
        to="/content"
        className={baseClass}
        onClick={handleClick}
      >
        {contentText}
      </Link>
      <Link 
        to="/events"
        className={baseClass}
        onClick={handleClick}
      >
        {eventsText}
      </Link>
      <Link 
        to="/members"
        className={baseClass}
        onClick={handleClick}
      >
        {membersText}
      </Link>
      <Link 
        to="/forum"
        className={baseClass}
        onClick={handleClick}
      >
        {forumText}
      </Link>
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
