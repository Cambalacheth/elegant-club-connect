
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem, ContentType } from "@/types/content";
import { useToast } from "@/hooks/use-toast";

export const useContent = (type?: ContentType) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, [type]);

  const fetchContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("content")
        .select("*, author:profiles(username)")
        .eq('published', true);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedData: ContentItem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        content: item.content || undefined,
        imageUrl: item.image_url || "",
        type: item.type as ContentType,
        author_id: item.author_id,
        author_username: item.author?.username || "Usuario",
        videoUrl: item.video_url || undefined,
        resourceUrl: item.resource_url || undefined,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category,
        published: item.published
      }));

      setContent(transformedData);
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
  };

  const createContent = async (newContent: Partial<ContentItem>) => {
    try {
      const { data, error } = await supabase.from("content").insert([
        {
          title: newContent.title,
          description: newContent.description,
          content: newContent.content,
          image_url: newContent.imageUrl,
          type: newContent.type,
          author_id: newContent.author_id,
          video_url: newContent.videoUrl,
          resource_url: newContent.resourceUrl,
          category: newContent.category,
          published: newContent.published || false
        }
      ]).select();

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Contenido creado correctamente",
      });

      return data[0];
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
      const { data, error } = await supabase
        .from("content")
        .update({
          title: updates.title,
          description: updates.description,
          content: updates.content,
          image_url: updates.imageUrl,
          video_url: updates.videoUrl,
          resource_url: updates.resourceUrl,
          category: updates.category,
          published: updates.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Contenido actualizado correctamente",
      });

      return data[0];
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
      const { error } = await supabase
        .from("content")
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Contenido eliminado correctamente",
      });

      setContent(content.filter(item => item.id !== id));
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
    content,
    isLoading,
    error,
    refetch: fetchContent,
    createContent,
    updateContent,
    deleteContent
  };
};
