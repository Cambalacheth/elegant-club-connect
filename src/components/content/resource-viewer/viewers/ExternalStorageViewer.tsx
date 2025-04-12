
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Presentation } from "lucide-react";
import { getEmbedUrl } from "../utils/resourceTypeUtils";

interface ExternalStorageViewerProps {
  url: string;
  type?: string;
}

export const ExternalStorageViewer = ({ url, type }: ExternalStorageViewerProps) => {
  // Convert Google Drive link to embedding URL if needed
  const embedUrl = getEmbedUrl(url);
  
  if (embedUrl) {
    return (
      <div className="flex flex-col space-y-4">
        <iframe 
          src={embedUrl}
          width="100%" 
          height="500px" 
          className="border-0 rounded-lg shadow-md"
          title="Contenido externo"
          allowFullScreen
        />
        <div className="flex justify-center">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-600 hover:underline"
          >
            Ver en sitio original
          </a>
        </div>
      </div>
    );
  }
  
  // Fallback for other external links
  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        <Presentation className="h-12 w-12 text-gray-400" />
        <div className="text-center">
          <p className="font-medium text-gray-700">
            Enlace externo
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Este contenido está alojado en un servicio externo
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-2"
          asChild
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            Abrir enlace
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
