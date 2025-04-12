
import React from "react";
import { RoleBadgeProps } from "./types/debate-types";

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  switch (role) {
    case "verified":
      return <span className="bg-club-orange/20 text-club-orange text-xs px-2 py-0.5 rounded-full">Verificado</span>;
    case "moderator":
      return <span className="bg-club-green/20 text-club-green text-xs px-2 py-0.5 rounded-full">Moderador</span>;
    case "admin":
      return <span className="bg-club-brown/20 text-club-brown text-xs px-2 py-0.5 rounded-full">Admin</span>;
    default:
      return null;
  }
};

export default RoleBadge;
