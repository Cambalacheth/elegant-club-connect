
import { Badge } from "@/components/ui/badge";
import { ContentItem, ContentType } from "@/types/content";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import VideoEmbed from "@/components/content/VideoEmbed";

interface ContentDetailHeaderProps {
  content: ContentItem;
  getTypeLabel: (type?: ContentType) => string;
}

const ContentDetailHeader = ({ content, getTypeLabel }: ContentDetailHeaderProps) => {
  return (
    <header>
      <div className="flex justify-between items-start mb-4">
        <Badge variant="outline" className="text-club-orange border-club-orange font-medium">
          {getTypeLabel(content?.type)}
          {content?.resourceType && ` - ${content.resourceType}`}
        </Badge>
        <div className="flex items-center text-sm text-club-brown/70">
          <CalendarIcon size={14} className="mr-1" />
          {content?.created_at && (
            <time dateTime={new Date(content.created_at).toISOString()}>
              {format(new Date(content.created_at), "d 'de' MMMM, yyyy", {
                locale: es,
              })}
            </time>
          )}
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-serif text-club-brown mb-8">
        {content?.title}
      </h1>

      {content?.type === "video" && content.videoId ? (
        <VideoEmbed videoId={content.videoId} title={content.title} />
      ) : content?.imageUrl && (
        <img
          src={content.imageUrl}
          alt={content.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        />
      )}
    </header>
  );
};

export default ContentDetailHeader;
