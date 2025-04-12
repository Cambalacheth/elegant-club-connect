
import { useState, useEffect, useCallback } from "react";
import { ContentItem, ContentType } from "@/types/content";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchPublishedContent, 
  fetchAllContentData, 
  createContentItem, 
  updateContentItem, 
  deleteContentItem 
} from "@/services/contentService";
import { filterContentById } from "@/utils/contentUtils";

export const useContent = (type?: ContentType) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const transformedData = await fetchPublishedContent(type);
      setContentItems(transformedData);
    } catch (error: any) {
      console.error("Error fetching content:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudo cargar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, toast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const fetchAllContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const transformedData = await fetchAllContentData(type);
      setContentItems(transformedData);
    } catch (error: any) {
      console.error("Error fetching all content:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudo cargar todo el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, toast]);

  const createContent = async (newContent: Partial<ContentItem>) => {
    try {
      const createdItem = await createContentItem(newContent);
      
      // Update local state by adding the new item
      setContentItems(prevItems => [createdItem, ...prevItems]);
      
      toast({
        title: "Éxito",
        description: "Contenido creado correctamente",
      });
      
      return createdItem;
    } catch (error: any) {
      console.error("Error creating content:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el contenido",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>) => {
    try {
      const updatedItem = await updateContentItem(id, updates);
      
      // Update local state by replacing the updated item
      setContentItems(prevItems => 
        prevItems.map(item => item.id === id ? updatedItem : item)
      );
      
      toast({
        title: "Éxito",
        description: "Contenido actualizado correctamente",
      });
      
      return updatedItem;
    } catch (error: any) {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el contenido",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await deleteContentItem(id);
      setContentItems(filterContentById(contentItems, id));
      toast({
        title: "Éxito",
        description: "Contenido eliminado correctamente",
      });
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el contenido",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    contentItems,
    isLoading,
    error,
    refetch: fetchContent,
    fetchAllContent,
    createContent,
    updateContent,
    deleteContent
  };
};
