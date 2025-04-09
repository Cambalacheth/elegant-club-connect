
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem, ContentType } from "@/types/content";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import VideoEmbed from "@/components/content/VideoEmbed";
import { extractYoutubeVideoId } from "@/services/contentService";

const ContentDetail = () => {
  const { type, id } = useParams();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("content")
          .select("*, author:profiles(username, level)")
          .eq("id", id)
          .eq("published", true)
          .single();

        if (error) throw error;
        
        // Extract YouTube video ID if video URL exists
        const videoId = data.video_url ? extractYoutubeVideoId(data.video_url) : null;
        
        // Transform database fields to match ContentItem interface
        const transformedContent: ContentItem = {
          id: data.id,
          title: data.title,
          description: data.description || "",
          content: data.content || undefined,
          imageUrl: data.image_url || "",
          type: data.type as ContentType,
          author_id: data.author_id,
          author_username: data.author?.username || "Usuario",
          author_role: data.author?.level,
          videoUrl: data.video_url || undefined,
          videoId: videoId || undefined,
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

  // SEO Title and Description based on content
  const pageTitle = content 
    ? `${content.title} | ${getTypeLabel(content.type)} | Terreta Hub` 
    : "Contenido | Terreta Hub";
  
  const pageDescription = content?.description && content.description.length > 10
    ? content.description.substring(0, 160)
    : "Contenido de la comunidad en Terreta Hub";

  function getTypeLabel(type?: ContentType): string {
    if (!type) return "Contenido";
    switch (type) {
      case "article": return "Artículo";
      case "video": return "Video";
      case "guide": return "Guía";
      case "resource": return "Recurso";
      default: return "Contenido";
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Helmet>
          <title>Cargando Contenido | Terreta Hub</title>
          <meta name="description" content="Cargando contenido de la comunidad..." />
        </Helmet>
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
        <Helmet>
          <title>Contenido no encontrado | Terreta Hub</title>
          <meta name="description" content="El contenido solicitado no pudo ser encontrado." />
        </Helmet>
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
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {content.imageUrl && <meta property="og:image" content={content.imageUrl} />}
        <meta property="og:type" content="article" />
        {content.author_username && <meta property="article:author" content={content.author_username} />}
        {content.created_at && <meta property="article:published_time" content={content.created_at} />}
        {content.updated_at && <meta property="article:modified_time" content={content.updated_at} />}
        {content.category && <meta property="article:section" content={content.category} />}
        <link rel="canonical" href={`${window.location.origin}/recursos/${content.type}/${content.id}`} />
      </Helmet>
      
      <Navbar />
      
      <article className="container mx-auto px-6 pt-32 pb-16">
        <header>
          <h1 className="text-4xl md:text-5xl font-serif text-club-brown mb-8">
            {content.title}
          </h1>

          {content.type === "video" && content.videoId ? (
            <VideoEmbed videoId={content.videoId} title={content.title} />
          ) : content.imageUrl && (
            <img
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-club-brown/70 mb-8">
            <span className="flex items-center gap-2">
              Por {content.author_username || "Usuario"}
              {content.author_role && (
                <Badge variant="outline" className="ml-1">
                  {content.author_role}
                </Badge>
              )}
            </span>
            <span>•</span>
            <time dateTime={new Date(content.created_at).toISOString()}>
              {format(new Date(content.created_at), "d 'de' MMMM, yyyy", {
                locale: es,
              })}
            </time>
            <span>•</span>
            <span>{content.category}</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="text-lg text-club-brown/80 mb-8">
            <p>{content.description}</p>
          </div>
          
          {content.content && (
            <div className="text-club-brown whitespace-pre-wrap">
              {content.content}
            </div>
          )}
          
          {content.type === "video" && content.videoUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-club-brown mb-4">Enlace Original:</h3>
              <a
                href={content.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-club-orange hover:text-club-terracotta"
              >
                Ver en YouTube →
              </a>
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
