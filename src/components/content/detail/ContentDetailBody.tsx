
import React from "react";
import { ContentItem } from "@/types/content";
import { ResourceViewer } from "@/components/content/resource-viewer/ResourceViewer";

interface ContentDetailBodyProps {
  item: ContentItem;
}

const ContentDetailBody: React.FC<ContentDetailBodyProps> = ({ item }) => {
  // For resources
  if (item.type === "resource" && item.resourceUrl) {
    return (
      <div className="space-y-6">
        {item.description && (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: item.description }} />
        )}
        
        <div className="mt-6">
          <ResourceViewer 
            url={item.resourceUrl} 
            type={item.resourceType}
          />
        </div>
      </div>
    );
  }
  
  // For videos
  if (item.type === "video" && item.videoId) {
    return (
      <div className="space-y-6">
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${item.videoId}`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {item.description && (
          <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: item.description }} />
        )}
      </div>
    );
  }
  
  // For articles and guides (content)
  if (item.content) {
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />;
  }
  
  // Fallback to description if no content
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: item.description }} />;
};

export default ContentDetailBody;
