
import React, { useState } from "react";
import { UserRole, canCreateContent } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Video, BookOpen, Newspaper } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContentForm } from "./ContentForm";
import { useContent } from "@/hooks/useContent";
import { useForumUser } from "@/hooks/useForumUser";
import { ContentType } from "@/types/content";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [selectedContentType, setSelectedContentType] = useState<ContentType>("article");
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
  
  const contentTypes = [
    { id: "article", name: "Artículo", icon: <FileText className="h-4 w-4" />, color: "bg-blue-500" },
    { id: "video", name: "Video", icon: <Video className="h-4 w-4" />, color: "bg-red-500" },
    { id: "guide", name: "Guía", icon: <BookOpen className="h-4 w-4" />, color: "bg-green-500" },
    { id: "resource", name: "Recurso", icon: <Newspaper className="h-4 w-4" />, color: "bg-purple-500" },
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
              <div className="p-4 bg-gray-100">
                <DialogTitle className="sr-only">Selecciona el tipo de contenido</DialogTitle>
                <DialogDescription>
                  <Tabs 
                    defaultValue="article" 
                    onValueChange={(value) => setSelectedContentType(value as ContentType)}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-4 w-full">
                      {contentTypes.map(type => (
                        <TabsTrigger 
                          key={type.id} 
                          value={type.id}
                          className="flex items-center justify-center gap-2 data-[state=active]:text-white"
                          style={{
                            '--tw-bg-opacity': '1',
                            background: type.id === selectedContentType ? 
                              (type.id === 'article' ? 'linear-gradient(to right, rgb(59, 130, 246), rgb(29, 78, 216))' :
                               type.id === 'video' ? 'linear-gradient(to right, rgb(239, 68, 68), rgb(185, 28, 28))' :
                               type.id === 'guide' ? 'linear-gradient(to right, rgb(34, 197, 94), rgb(21, 128, 61))' :
                               'linear-gradient(to right, rgb(168, 85, 247), rgb(126, 34, 206))') : undefined
                          }}
                        >
                          {type.icon} 
                          {type.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </DialogDescription>
              </div>
              <ContentForm
                contentType={selectedContentType}
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
