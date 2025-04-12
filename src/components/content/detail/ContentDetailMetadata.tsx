
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "@/types/content";
import { User, Clock, Award, Tag, DollarSign } from "lucide-react";

interface ContentDetailMetadataProps {
  content: ContentItem;
  getDifficultyLabel: (difficulty?: string) => string;
  getPriceLabel: (price?: string) => string;
}

const ContentDetailMetadata = ({ 
  content, 
  getDifficultyLabel, 
  getPriceLabel 
}: ContentDetailMetadataProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-club-brown/70 mb-8 bg-white/50 p-4 rounded-lg">
      {content?.source && (
        <div className="flex items-center gap-1">
          <User size={16} />
          <span>{content.source}</span>
        </div>
      )}
      
      {content?.author_username && (
        <div className="flex items-center gap-1">
          <span>Publicado por: {content.author_username}</span>
          {content?.author_role && (
            <Badge variant="outline" className="ml-1">
              {content.author_role}
            </Badge>
          )}
        </div>
      )}
      
      {content?.duration && (
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{content.duration}</span>
        </div>
      )}
      
      {content?.difficulty && (
        <div className="flex items-center gap-1">
          <Award size={16} />
          <span>Nivel: {getDifficultyLabel(content.difficulty)}</span>
        </div>
      )}
      
      {content?.price && (
        <div className="flex items-center gap-1">
          <DollarSign size={16} />
          <span>{getPriceLabel(content.price)}</span>
        </div>
      )}
      
      {content?.category && (
        <div className="flex items-center gap-1">
          <Tag size={16} />
          <span>{content.category}</span>
        </div>
      )}
    </div>
  );
};

export default ContentDetailMetadata;
