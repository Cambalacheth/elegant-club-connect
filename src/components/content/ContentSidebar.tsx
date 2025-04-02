
import React from "react";
import { UserRole } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface ContentSidebarProps {
  selectedCategory: string | "all";
  onCategoryChange: (category: string | "all") => void;
  userRole: UserRole;
}

const ContentSidebar: React.FC<ContentSidebarProps> = ({
  selectedCategory,
  onCategoryChange,
  userRole,
}) => {
  const categories = [
    { id: "all", name: "Todas las categorías" },
    { id: "General", name: "General" },
    { id: "Legal", name: "Legal" },
    { id: "Tecnología", name: "Tecnología" },
    { id: "Finanzas", name: "Finanzas" },
    { id: "Salud", name: "Salud" },
    { id: "Audiovisual", name: "Audiovisual" },
    { id: "Eventos", name: "Eventos" },
  ];

  return (
    <aside className="space-y-6">
      {userRole === "admin" && (
        <div className="mb-6">
          <Link to="/admin">
            <Button 
              className="w-full bg-gradient-to-r from-club-orange to-club-terracotta hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" /> Gestionar contenido
            </Button>
          </Link>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-medium text-lg mb-4 text-club-brown">Categorías</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                selectedCategory === category.id
                  ? "bg-club-orange/10 text-club-orange font-medium"
                  : "text-club-brown hover:bg-club-beige-dark"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ContentSidebar;
