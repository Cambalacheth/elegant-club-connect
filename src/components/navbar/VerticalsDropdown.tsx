
import { Link } from "react-router-dom";
import { ChevronDown, Gavel, Palette, Briefcase, Stethoscope, Users, Cpu } from "lucide-react";
import { useVerticalDomains } from "@/hooks/useVerticalDomains";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface VerticalsDropdownProps {
  currentLanguage: string;
  handleClick?: () => void;
}

export const VerticalsDropdown = ({ currentLanguage, handleClick }: VerticalsDropdownProps) => {
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
