
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem, ContentType } from "@/types/content";
import Navbar from "@/components/Navbar";
import { extractYoutubeVideoId } from "@/services/contentService";
import ContentDetailSkeleton from "@/components/content/detail/ContentDetailSkeleton";
import ContentNotFound from "@/components/content/detail/ContentNotFound";
import ContentDetailHeader from "@/components/content/detail/ContentDetailHeader";
import ContentDetailMetadata from "@/components/content/detail/ContentDetailMetadata";
import ContentDetailBody from "@/components/content/detail/ContentDetailBody";
import { getTypeLabel, getDifficultyLabel, getPriceLabel } from "@/components/content/detail/contentDetailUtils";

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
          // Fix: Convert the string type to ContentType by validating it as a valid content type
          type: validateContentType(data.type),
          author_id: data.author_id,
          author_username: data.author?.username || "Usuario",
          author_role: data.author?.level,
          
          // Video fields
          videoUrl: data.video_url || undefined,
          videoId: videoId || undefined,
          duration: data.duration || undefined,
          
          // Resource fields
          resourceUrl: data.resource_url || undefined,
          resourceType: data.resource_type || undefined,
          price: data.price || undefined,
          
          // Guide fields
          difficulty: data.difficulty || undefined,
          downloadUrl: data.download_url || undefined,
          
          // Common fields
          source: data.source || undefined,
          externalUrl: data.external_url || undefined,
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

  // Helper function to validate content type
  const validateContentType = (type: string): ContentType => {
    const validTypes: ContentType[] = ['article', 'video', 'guide', 'resource'];
    return validTypes.includes(type as ContentType) 
      ? (type as ContentType) 
      : 'article'; // Default to article if invalid type
  };

  // SEO Title and Description based on content
  const pageTitle = content 
    ? `${content.title} | ${getTypeLabel(content.type)} | Terreta Hub` 
    : "Contenido | Terreta Hub";
  
  const pageDescription = content?.description && content.description.length > 10
    ? content.description.substring(0, 160)
    : "Contenido de la comunidad en Terreta Hub";

  if (isLoading) {
    return <ContentDetailSkeleton />;
  }

  if (!content) {
    return <ContentNotFound />;
  }

  return (
    <div className="min-h-screen bg-club-beige">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {content?.imageUrl && <meta property="og:image" content={content.imageUrl} />}
        <meta property="og:type" content="article" />
        {content?.author_username && <meta property="article:author" content={content.author_username} />}
        {content?.created_at && <meta property="article:published_time" content={content.created_at} />}
        {content?.updated_at && <meta property="article:modified_time" content={content.updated_at} />}
        {content?.category && <meta property="article:section" content={content.category} />}
        <link rel="canonical" href={`${window.location.origin}/recursos/${content?.type}/${content?.id}`} />
      </Helmet>
      
      <Navbar />
      
      <article className="container mx-auto px-6 pt-32 pb-16">
        <ContentDetailHeader 
          content={content} 
          getTypeLabel={getTypeLabel} 
        />

        <ContentDetailMetadata 
          content={content} 
          getDifficultyLabel={getDifficultyLabel}
          getPriceLabel={getPriceLabel}
        />

        <ContentDetailBody content={content} />
      </article>
    </div>
  );
};

export default ContentDetail;
