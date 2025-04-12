
import { ContentItem } from "@/types/content";
import { ExternalLink, Download } from "lucide-react";

interface ContentDetailLinksProps {
  content: ContentItem;
}

const ContentDetailLinks = ({ content }: ContentDetailLinksProps) => {
  return (
    <div className="mt-8 flex flex-col gap-3">
      {content?.externalUrl && (
        <a
          href={content.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-club-orange hover:text-club-terracotta"
        >
          <ExternalLink size={18} className="mr-2" />
          Enlace externo
        </a>
      )}
      
      {content?.videoUrl && (
        <a
          href={content.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-club-orange hover:text-club-terracotta"
        >
          <ExternalLink size={18} className="mr-2" />
          Ver en YouTube
        </a>
      )}
      
      {content?.resourceUrl && (
        <a
          href={content.resourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-club-orange hover:text-club-terracotta"
        >
          <ExternalLink size={18} className="mr-2" />
          Acceder al recurso
        </a>
      )}
      
      {content?.downloadUrl && (
        <a
          href={content.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-club-orange hover:text-club-terracotta"
        >
          <Download size={18} className="mr-2" />
          Descargar
        </a>
      )}
    </div>
  );
};

export default ContentDetailLinks;
