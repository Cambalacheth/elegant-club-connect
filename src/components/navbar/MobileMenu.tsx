
import { UserRole } from "@/types/user";
import AuthButton from "./AuthButton";
import NavLinks from "./NavLinks";

interface MobileMenuProps {
  isOpen: boolean;
  currentLanguage: string;
  userRole: UserRole;
  user: any;
  handleAuthOrProfile: () => void;
  closeMenu: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  currentLanguage, 
  userRole, 
  user,
  handleAuthOrProfile,
  closeMenu 
}: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-club-beige/95 backdrop-blur-md shadow-lg py-4 animate-fade-in">
      <nav className="flex flex-col space-y-4 px-6">
        <NavLinks 
          currentLanguage={currentLanguage} 
          userRole={userRole} 
          isMobile={true}
          onMobileClick={closeMenu}
        />
        <AuthButton
          currentLanguage={currentLanguage}
          user={user}
          userRole={userRole}
          onClick={() => {
            closeMenu();
            handleAuthOrProfile();
          }}
          isMobile={true}
        />
      </nav>
    </div>
  );
};

export default MobileMenu;
