
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Video, BookOpen, Newspaper } from "lucide-react";
import { ContentForm } from "./ContentForm";
import { ContentTable } from "./ContentTable";
import { ContentItem, ContentType } from "@/types/content";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useContent } from "@/hooks/useContent";
import { UserRole, canManageContent } from "@/types/user";

interface ContentManagementProps {
  userId: string;
  userRole: UserRole;
}

export const ContentManagement = ({ userId, userRole }: ContentManagementProps) => {
  const [activeTab, setActiveTab] = useState<ContentType>("article");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    content,
    isLoading,
    refetch,
    createContent,
    updateContent,
    deleteContent
  } = useContent(activeTab);

  const handleCreateContent = async (data: Partial<ContentItem>) => {
    try {
      setIsSubmitting(true);
      await createContent(data);
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateContent = async (id: string, data: Partial<ContentItem>) => {
    try {
      setIsSubmitting(true);
      await updateContent(id, data);
      refetch();
    } catch (error) {
      console.error("Error updating content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteContent(id);
      refetch();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  if (!canManageContent(userRole)) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
        <h3 className="text-lg font-medium mb-2">Acceso restringido</h3>
        <p>Solo los moderadores y administradores pueden gestionar el contenido.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-club-brown">Administración de Contenido</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-club-orange hover:bg-club-terracotta text-white">
              <Plus className="mr-2 h-4 w-4" /> Nuevo contenido
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <ContentForm
              contentType={activeTab}
              onSubmit={handleCreateContent}
              isSubmitting={isSubmitting}
              userId={userId}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="article" onValueChange={(value) => setActiveTab(value as ContentType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="article" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Artículos
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center">
            <Video className="mr-2 h-4 w-4" /> Videos
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" /> Guías
          </TabsTrigger>
          <TabsTrigger value="resource" className="flex items-center">
            <Newspaper className="mr-2 h-4 w-4" /> Recursos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="article">
          <ContentTable
            items={content}
            isLoading={isLoading}
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
            type="article"
            userId={userId}
          />
        </TabsContent>
        
        <TabsContent value="video">
          <ContentTable
            items={content}
            isLoading={isLoading}
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
            type="video"
            userId={userId}
          />
        </TabsContent>
        
        <TabsContent value="guide">
          <ContentTable
            items={content}
            isLoading={isLoading}
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
            type="guide"
            userId={userId}
          />
        </TabsContent>
        
        <TabsContent value="resource">
          <ContentTable
            items={content}
            isLoading={isLoading}
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
            type="resource"
            userId={userId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
