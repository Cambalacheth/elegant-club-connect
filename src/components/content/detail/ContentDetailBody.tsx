
import { ContentItem } from "@/types/content";
import ContentDetailLinks from "./ContentDetailLinks";

interface ContentDetailBodyProps {
  content: ContentItem;
}

const ContentDetailBody = ({ content }: ContentDetailBodyProps) => {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="text-lg text-club-brown/80 mb-8">
        <p>{content?.description}</p>
      </div>
      
      {content?.content && (
        <div className="text-club-brown whitespace-pre-wrap">
          {content.content}
        </div>
      )}
      
      <ContentDetailLinks content={content} />
    </div>
  );
};

export default ContentDetailBody;
