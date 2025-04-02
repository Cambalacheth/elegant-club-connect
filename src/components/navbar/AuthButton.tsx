
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import UserRoleIcon from "./UserRoleIcon";
import { UserRole } from "@/types/user";

interface AuthButtonProps {
  currentLanguage: string;
  user: any;
  userRole: UserRole;
  onClick: () => void;
  isMobile?: boolean;
}

const AuthButton = ({ currentLanguage, user, userRole, onClick, isMobile = false }: AuthButtonProps) => {
  const enterClubText = currentLanguage === "en" 
    ? (user ? "My Profile" : "Enter the Club") 
    : (user ? "Mi Perfil" : "Ingresar al Club");
    
  const baseClass = isMobile
    ? "bg-club-orange text-club-white px-6 py-2.5 rounded-full inline-block text-center btn-hover-effect flex items-center gap-2 justify-center"
    : "bg-club-orange text-club-white px-6 py-2.5 rounded-full btn-hover-effect flex items-center gap-2 ml-2";
    
  return (
    <button onClick={onClick} className={baseClass}>
      {enterClubText}
      <div className="flex items-center gap-1">
        {user && <User size={16} />}
        <UserRoleIcon userRole={userRole} />
      </div>
    </button>
  );
};

export default AuthButton;
