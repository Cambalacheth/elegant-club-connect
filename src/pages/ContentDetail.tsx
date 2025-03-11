
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from "@/types/content";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ContentDetail = () => {
  const { type, id } = useParams();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("content")
          .select(`
            *,
            profiles:author_id(username)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Transform database fields to match ContentItem interface
        const transformedContent: ContentItem = {
          id: data.id,
          title: data.title,
          description: data.description || "",
          content: data.content || undefined,
          imageUrl: data.image_url || "",
          type: data.type,
          author_id: data.author_id,
          author_username: data.profiles?.username || "Usuario",
          videoUrl: data.video_url || undefined,
          resourceUrl: data.resource_url || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at,
          category: data.category,
          published: data.published
        };
        
        setContent(transformedContent);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-16">
          <Skeleton className="h-12 w-2/3 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-16">
          <h1 className="text-4xl font-serif text-club-brown mb-8">
            Contenido no encontrado
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-club-beige">
      <Navbar />
      <article className="container mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-club-brown mb-8">
          {content.title}
        </h1>

        {content.imageUrl && (
          <img
            src={content.imageUrl}
            alt={content.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}

        {content.type === "video" && content.videoUrl && (
          <div className="aspect-video mb-8">
            <iframe
              src={content.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-club-brown/70 mb-8">
          <span>Por {content.author_username || "Usuario"}</span>
          <span>•</span>
          <span>
            {format(new Date(content.created_at), "d 'de' MMMM, yyyy", {
              locale: es,
            })}
          </span>
          <span>•</span>
          <span>{content.category}</span>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-club-brown/80 mb-8">{content.description}</p>
          {content.content && (
            <div className="text-club-brown whitespace-pre-wrap">
              {content.content}
            </div>
          )}
          {content.type === "resource" && content.resourceUrl && (
            <a
              href={content.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 text-club-orange hover:text-club-terracotta"
            >
              Acceder al recurso →
            </a>
          )}
        </div>
      </article>
    </div>
  );
};

export default ContentDetail;
