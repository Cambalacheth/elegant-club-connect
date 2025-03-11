
import { ContentItem } from "@/types/content";
import { FileText, Video, Newspaper, BookOpen, Calendar, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

interface ContentCardProps {
  item: ContentItem;
  currentLanguage?: string;
}

export const ContentCard = ({ item, currentLanguage = "es" }: ContentCardProps) => {
  const { id, title, description, type, imageUrl, author_username, created_at, category } = item;
  
  const readMoreText = currentLanguage === "en" ? "Read More" : "Leer Más";
  const watchText = currentLanguage === "en" ? "Watch" : "Ver";
  
  const TypeIcon = () => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5 text-club-orange" />;
      case "video":
        return <Video className="h-5 w-5 text-club-orange" />;
      case "guide":
        return <BookOpen className="h-5 w-5 text-club-orange" />;
      case "resource":
        return <Newspaper className="h-5 w-5 text-club-orange" />;
      default:
        return <FileText className="h-5 w-5 text-club-orange" />;
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-white hover:shadow-md transition-shadow duration-300">
      <div className="h-48 overflow-hidden relative group">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
        {type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Video className="h-12 w-12 text-white" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="flex items-center gap-1 font-normal">
            <TypeIcon />
            <span>{category}</span>
          </Badge>
          <span className="text-xs text-club-brown/70 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: es })}
          </span>
        </div>
        <CardTitle className="text-xl font-medium text-club-brown">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-club-brown/80 line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-club-brown/70 flex items-center gap-1">
          <User className="h-3 w-3" />
          {author_username || "Usuario"}
        </span>
        <Link 
          to={`/content/${type}/${id}`} 
          className="text-sm font-medium text-club-orange hover:text-club-terracotta flex items-center gap-1"
        >
          {type === "video" ? watchText : readMoreText}
        </Link>
      </CardFooter>
    </Card>
  );
};
