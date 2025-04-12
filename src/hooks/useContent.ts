
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
      
      // Map the returned item to ContentItem format to ensure all properties match
      const mappedItem: ContentItem = {
        id: createdItem.id,
        title: createdItem.title,
        description: createdItem.description || "",
        content: createdItem.content,
        imageUrl: createdItem.image_url || "",
        type: createdItem.type as ContentType,
        author_id: createdItem.author_id,
        source: createdItem.source,
        externalUrl: createdItem.external_url,
        videoUrl: createdItem.video_url,
        videoId: undefined, // Will be extracted in the service
        duration: createdItem.duration,
        difficulty: createdItem.difficulty,
        downloadUrl: createdItem.download_url,
        resourceType: createdItem.resource_type,
        resourceUrl: createdItem.resource_url,
        price: createdItem.price,
        created_at: createdItem.created_at,
        updated_at: createdItem.updated_at,
        category: createdItem.category,
        published: createdItem.published,
        author_username: "", // Will be populated if needed
        author_role: "", // Will be populated if needed
      };
      
      // Update local state by adding the new item
      setContentItems(prevItems => [mappedItem, ...prevItems]);
      
      toast({
        title: "Éxito",
        description: "Contenido creado correctamente",
      });
      
      return mappedItem;
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
      
      // Map the returned item to ContentItem format to ensure all properties match
      const mappedItem: ContentItem = {
        id: updatedItem.id,
        title: updatedItem.title,
        description: updatedItem.description || "",
        content: updatedItem.content,
        imageUrl: updatedItem.image_url || "",
        type: updatedItem.type as ContentType,
        author_id: updatedItem.author_id,
        source: updatedItem.source,
        externalUrl: updatedItem.external_url,
        videoUrl: updatedItem.video_url,
        videoId: undefined, // Will be extracted in the service
        duration: updatedItem.duration,
        difficulty: updatedItem.difficulty,
        downloadUrl: updatedItem.download_url,
        resourceType: updatedItem.resource_type,
        resourceUrl: updatedItem.resource_url,
        price: updatedItem.price,
        created_at: updatedItem.created_at,
        updated_at: updatedItem.updated_at,
        category: updatedItem.category,
        published: updatedItem.published,
        author_username: "", // Will be populated if needed
        author_role: "", // Will be populated if needed
      };
      
      // Update local state by replacing the updated item
      setContentItems(prevItems => 
        prevItems.map(item => item.id === id ? mappedItem : item)
      );
      
      toast({
        title: "Éxito",
        description: "Contenido actualizado correctamente",
      });
      
      return mappedItem;
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
