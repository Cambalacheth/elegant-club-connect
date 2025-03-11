
import { ContentItem, ContentType } from "@/types/content";
import { ContentCard } from "./ContentCard";
import { NoResults } from "@/components/search/NoResults";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentListProps {
  items: ContentItem[];
  type: ContentType;
  isLoading: boolean;
  currentLanguage?: string;
}

export const ContentList = ({ items, type, isLoading, currentLanguage = "es" }: ContentListProps) => {
  const noResultsText = currentLanguage === "en" 
    ? `No ${type}s found` 
    : type === "article" 
      ? "No se encontraron artículos"
      : type === "video"
        ? "No se encontraron videos"
        : type === "guide"
          ? "No se encontraron guías"
          : "No se encontraron recursos";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg shadow-sm h-full flex flex-col">
            <Skeleton className="h-48 w-full" />
            <div className="p-6">
              <Skeleton className="h-6 w-2/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <NoResults noResultsText={noResultsText} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map(item => (
        <ContentCard key={item.id} item={item} currentLanguage={currentLanguage} />
      ))}
    </div>
  );
};
