
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Video, BookOpen, Newspaper } from "lucide-react";
import { ContentForm } from "./ContentForm";
import { ContentTable } from "./ContentTable";
import { ContentItem, ContentType } from "@/types/content";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useContent } from "@/hooks/useContent";
import { UserRole, canManageContent, canAdminContent } from "@/types/user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContentManagementProps {
  userId: string;
  userRole: UserRole;
}

export const ContentManagement = ({ userId, userRole }: ContentManagementProps) => {
  const [activeTab, setActiveTab] = useState<ContentType>("article");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    contentItems,
    isLoading,
    fetchAllContent,
    createContent,
    updateContent,
    deleteContent
  } = useContent(activeTab);

  // Fetch all content including unpublished when component mounts or tab changes
  useState(() => {
    if (canManageContent(userRole)) {
      fetchAllContent();
    }
  });

  const handleCreateContent = async (data: Partial<ContentItem>) => {
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

  const handleUpdateContent = async (id: string, data: Partial<ContentItem>) => {
    try {
      setIsSubmitting(true);
      await updateContent(id, data);
      fetchAllContent();
    } catch (error) {
      console.error("Error updating content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteContent(id);
      fetchAllContent();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  // Update this condition to use canAdminContent for consistency
  if (!canAdminContent(userRole)) {
    return (
      <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-800">
        <AlertTitle className="text-lg font-medium">Acceso restringido</AlertTitle>
        <AlertDescription>
          Solo los administradores pueden gestionar el contenido.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-club-brown">Administración de Contenido</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="bg-gradient-to-br from-club-orange-mid to-club-terracotta hover:opacity-90 text-white font-medium shadow-md transition-all"
            >
              <Plus className="mr-2 h-5 w-5" /> Nuevo contenido
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm border-club-beige shadow-xl">
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
        <TabsList className="mb-6 bg-club-beige/50 p-1.5">
          <TabsTrigger value="article" className="flex items-center data-[state=active]:bg-club-orange data-[state=active]:text-white">
            <FileText className="mr-2 h-4 w-4" /> Artículos
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center data-[state=active]:bg-club-orange data-[state=active]:text-white">
            <Video className="mr-2 h-4 w-4" /> Videos
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center data-[state=active]:bg-club-orange data-[state=active]:text-white">
            <BookOpen className="mr-2 h-4 w-4" /> Guías
          </TabsTrigger>
          <TabsTrigger value="resource" className="flex items-center data-[state=active]:bg-club-orange data-[state=active]:text-white">
            <Newspaper className="mr-2 h-4 w-4" /> Recursos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="article">
          <ContentTable
            items={contentItems}
            isLoading={isLoading}
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
            type="article"
            userId={userId}
          />
        </TabsContent>
        
        <TabsContent value="video">
          <ContentTable
            items={contentItems}
            isLoading={isLoading}
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
            type="video"
            userId={userId}
          />
        </TabsContent>
        
        <TabsContent value="guide">
          <ContentTable
            items={contentItems}
            isLoading={isLoading}
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
            type="guide"
            userId={userId}
          />
        </TabsContent>
        
        <TabsContent value="resource">
          <ContentTable
            items={contentItems}
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
