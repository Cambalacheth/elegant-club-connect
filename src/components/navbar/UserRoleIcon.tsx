
import { CheckCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import { UserRole } from "@/types/user";

interface UserRoleIconProps {
  userRole: UserRole;
}

const UserRoleIcon = ({ userRole }: UserRoleIconProps) => {
  if (!userRole || userRole === "registered") return null;
  
  switch (userRole) {
    case "verified":
      return <CheckCircle size={16} className="text-club-orange" />;
    case "moderator":
      return <ShieldAlert size={16} className="text-club-orange" />;
    case "admin":
      return <ShieldCheck size={16} className="text-club-orange" />;
    default:
      return null;
  }
};

export default UserRoleIcon;
