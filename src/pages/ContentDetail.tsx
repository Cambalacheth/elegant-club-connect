
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Calendar, User, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from "@/types/content";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ContentDetail = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("content")
          .select(`
            *,
            profiles:author_id (username)
          `)
          .eq("id", id)
          .eq("published", true)
          .single();

        if (error) {
          throw error;
        }

        // Transform the data to match ContentItem interface
        const contentItem: ContentItem = {
          id: data.id,
          title: data.title,
          description: data.description,
          content: data.content,
          imageUrl: data.image_url,
          type: data.type,
          author_id: data.author_id,
          author_username: data.profiles?.username,
          videoUrl: data.video_url,
          resourceUrl: data.resource_url,
          created_at: data.created_at,
          updated_at: data.updated_at,
          category: data.category,
          published: data.published
        };

        setContent(contentItem);
      } catch (error: any) {
        console.error("Error fetching content:", error);
        setError("No se pudo cargar el contenido");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContent();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-club-beige">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-16">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="space-y-4 max-w-4xl mx-auto">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-club-beige">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-16 text-center">
          <h1 className="text-3xl font-serif text-club-brown mb-4">Contenido no encontrado</h1>
          <p className="text-club-brown/80 mb-6">
            El contenido que buscas no existe o no está disponible.
          </p>
          <Link to="/content">
            <Button className="bg-club-orange hover:bg-club-terracotta text-white">
              <ChevronLeft className="mr-2 h-4 w-4" /> Volver al contenido
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const renderContent = () => {
    switch (content.type) {
      case "article":
      case "guide":
        return (
          <div className="prose prose-lg max-w-none prose-headings:text-club-brown prose-p:text-club-brown/90">
            {content.content?.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        );
      case "video":
        return (
          <div className="aspect-video w-full mb-8">
            <iframe
              src={content.videoUrl}
              title={content.title}
              className="w-full h-full rounded-lg"
              allowFullScreen
            ></iframe>
          </div>
        );
      case "resource":
        return (
          <div className="text-center p-10 border border-gray-200 rounded-lg bg-white">
            <p className="mb-6 text-club-brown/80">
              Este es un recurso externo. Haz clic en el botón para acceder.
            </p>
            <a
              href={content.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="bg-club-orange hover:bg-club-terracotta text-white">
                Acceder al recurso
              </Button>
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-club-beige">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <Link to="/content" className="inline-flex items-center text-club-orange hover:text-club-terracotta mb-6">
            <ChevronLeft className="mr-1 h-4 w-4" /> Volver al contenido
          </Link>
          
          <h1 className="text-4xl font-serif text-club-brown mb-6">{content.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <Badge variant="outline" className="flex items-center gap-1 font-normal">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(content.created_at), { addSuffix: true, locale: es })}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 font-normal">
              <User className="h-3 w-3" />
              {content.author_username || "Usuario"}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 font-normal">
              <Tag className="h-3 w-3" />
              {content.category}
            </Badge>
          </div>
          
          {content.imageUrl && (
            <div className="w-full h-96 mb-8 rounded-lg overflow-hidden shadow-md">
              <img
                src={content.imageUrl}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-club-brown mb-4">Descripción</h2>
            <p className="text-club-brown/80">{content.description}</p>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default ContentDetail;
