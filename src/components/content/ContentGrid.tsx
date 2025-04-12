
import React from "react";
import { ContentItem, ContentType } from "@/types/content";
import { ContentList } from "./ContentList";

interface ContentGridProps {
  items: ContentItem[];
  isLoading: boolean;
  contentType: ContentType;
}

const ContentGrid: React.FC<ContentGridProps> = ({ 
  items, 
  isLoading, 
  contentType 
}) => {
  console.log("ContentGrid rendering with items:", items.length);
  
  return (
    <div className="w-full">
      <ContentList 
        items={items}
        type={contentType}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ContentGrid;
