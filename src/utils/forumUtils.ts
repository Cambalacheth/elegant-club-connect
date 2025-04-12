
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Format date helper function
export const formatDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: es,
  });
};

// Helper to render role badges
export const renderRoleBadge = (role: string) => {
  switch (role) {
    case "verified":
      return {
        className: "bg-club-orange/20 text-club-orange text-xs px-2 py-0.5 rounded-full ml-2",
        text: "Verificado"
      };
    case "moderator":
      return {
        className: "bg-club-green/20 text-club-green text-xs px-2 py-0.5 rounded-full ml-2",
        text: "Moderador"
      };
    case "admin":
      return {
        className: "bg-club-brown/20 text-club-brown text-xs px-2 py-0.5 rounded-full ml-2",
        text: "Admin"
      };
    default:
      return null;
  }
};
