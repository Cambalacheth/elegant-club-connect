
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getEmbedUrl } from "../utils/resourceTypeUtils";

interface PresentationViewerProps {
  url: string;
}

export const PresentationViewer = ({ url }: PresentationViewerProps) => {
  // Check if it's a Google Slides link
  if (url.includes('docs.google.com/presentation')) {
    const embedUrl = getEmbedUrl(url);
    
    return (
      <div className="flex flex-col space-y-4">
        <iframe 
          src={embedUrl || url}
          width="100%" 
          height="500px" 
          className="border-0 rounded-lg shadow-md"
          title="Presentación de Google"
          allowFullScreen
        />
        <div className="flex justify-center">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Ver presentación en pantalla completa
          </a>
        </div>
      </div>
    );
  }
  
  // For PowerPoint files, use the Office Online Viewer
  return (
    <div className="flex flex-col space-y-4">
      <iframe 
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
        width="100%" 
        height="500px" 
        className="border-0 rounded-lg shadow-md"
        title="Presentación de PowerPoint"
        allowFullScreen
      />
      <div className="flex justify-center">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Ver presentación en pantalla completa
        </a>
      </div>
    </div>
  );
};
