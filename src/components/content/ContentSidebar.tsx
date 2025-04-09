
import React, { useState } from "react";
import { UserRole, canCreateContent } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ContentForm } from "./ContentForm";
import { useContent } from "@/hooks/useContent";
import { useForumUser } from "@/hooks/useForumUser";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createContent, fetchAllContent } = useContent("article");
  const { user } = useForumUser(); // Get the current user

  const handleCreateContent = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createContent(data);
      fetchAllContent();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {canCreateContent(userRole) && (
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-gradient-to-r from-club-orange to-club-terracotta hover:opacity-90"
              >
                <Plus className="mr-2 h-4 w-4" /> Nuevo contenido
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm border-club-beige shadow-xl">
              <ContentForm
                contentType="article"
                onSubmit={handleCreateContent}
                isSubmitting={isSubmitting}
                userId={user?.id || ""} // Pass the current user's ID here
              />
            </DialogContent>
          </Dialog>
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
