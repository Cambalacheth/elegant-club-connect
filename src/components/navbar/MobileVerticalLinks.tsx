
import { Link } from "react-router-dom";
import { Gavel, Palette, Briefcase, Stethoscope, Users, Cpu } from "lucide-react";
import { useVerticalDomains } from "@/hooks/useVerticalDomains";

interface MobileVerticalLinksProps {
  currentLanguage: string;
  handleClick?: () => void;
  baseClass: string;
}

export const MobileVerticalLinks = ({ currentLanguage, handleClick, baseClass }: MobileVerticalLinksProps) => {
  const { verticalDomains } = useVerticalDomains();
  const verticalesText = currentLanguage === "en" ? "Verticals" : "Verticales";

  // Helper to get icon based on path
  const getIconForPath = (path: string) => {
    if (path === "/legal") return <Gavel size={16} />;
    if (path === "/arte") return <Palette size={16} />;
    if (path === "/negocios") return <Briefcase size={16} />;
    if (path === "/salud") return <Stethoscope size={16} />;
    if (path === "/comunidad") return <Users size={16} />;
    if (path === "/tech") return <Cpu size={16} />;
    return null;
  };

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
