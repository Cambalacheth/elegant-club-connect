
import { useEffect, useState } from "react";
import { FileText, FileImage, Presentation, FileSpreadsheet, File } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResourceViewerProps {
  url: string;
  type?: string;
}

export const ResourceViewer = ({ url, type }: ResourceViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const fileExtension = url.split('.').pop()?.toLowerCase();
  const resourceType = type || getResourceTypeFromExtension(fileExtension);
  
  useEffect(() => {
    // Reset loading state when the URL changes
    setIsLoading(true);
    
    // Preload image if it's an image resource
    if (isImageResource(resourceType, fileExtension)) {
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
      img.src = url;
    } else {
      setIsLoading(false);
    }
  }, [url, resourceType, fileExtension]);
  
  if (!url) {
    return <div className="p-4 text-center text-gray-500">No hay recurso disponible</div>;
  }
  
  if (isLoading) {
    return <div className="p-4 text-center">Cargando recurso...</div>;
  }
  
  // Handle different resource types
  if (isImageResource(resourceType, fileExtension)) {
    return (
      <div className="overflow-hidden rounded-lg">
        <img 
          src={url} 
          alt="Recurso"
          className="w-full max-h-[600px] object-contain bg-gray-100"
        />
      </div>
    );
  }
  
  if (isPresentationResource(resourceType, fileExtension)) {
    return <PresentationViewer url={url} />;
  }
  
  if (isPDFResource(resourceType, fileExtension)) {
    return <PDFViewer url={url} />;
  }
  
  // Default fallback for other file types
  return <DefaultResourceViewer url={url} type={resourceType} extension={fileExtension} />;
};

// Presentación viewer (PowerPoint files)
const PresentationViewer = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-col space-y-4">
      <iframe 
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
        width="100%" 
        height="500px" 
        className="border-0 rounded-lg shadow-md"
        title="Presentación"
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

// PDF viewer
const PDFViewer = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-col space-y-4">
      <iframe 
        src={url} 
        width="100%" 
        height="500px" 
        className="border-0 rounded-lg shadow-md"
        title="Documento PDF"
      />
      <div className="flex justify-center">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-600 hover:underline"
        >
          Abrir PDF en una nueva pestaña
        </a>
      </div>
    </div>
  );
};

// Default resource viewer with download option
const DefaultResourceViewer = ({ 
  url, 
  type, 
  extension 
}: { 
  url: string; 
  type?: string;
  extension?: string;
}) => {
  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        {getResourceIcon(type, extension)}
        <div className="text-center">
          <p className="font-medium text-gray-700">
            {getResourceTypeLabel(type, extension)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Este tipo de archivo no se puede previsualizar
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-2"
          asChild
        >
          <a href={url} target="_blank" rel="noopener noreferrer" download>
            Descargar archivo
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

// Helper functions
function getResourceTypeFromExtension(extension?: string): string {
  if (!extension) return 'unknown';
  
  switch (extension) {
    case 'pdf':
      return 'document';
    case 'doc':
    case 'docx':
      return 'document';
    case 'xls':
    case 'xlsx':
      return 'spreadsheet';
    case 'ppt':
    case 'pptx':
      return 'presentation';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
      return 'infographic';
    default:
      return 'unknown';
  }
}

function isImageResource(type?: string, extension?: string): boolean {
  if (type === 'infographic') return true;
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '');
}

function isPresentationResource(type?: string, extension?: string): boolean {
  if (type === 'presentation') return true;
  return ['ppt', 'pptx'].includes(extension || '');
}

function isPDFResource(type?: string, extension?: string): boolean {
  if (type === 'document' && extension === 'pdf') return true;
  return extension === 'pdf';
}

function getResourceIcon(type?: string, extension?: string) {
  const iconClassName = "h-12 w-12 text-gray-400";
  
  switch (type) {
    case 'document':
      return <FileText className={iconClassName} />;
    case 'infographic':
      return <FileImage className={iconClassName} />;
    case 'presentation':
      return <Presentation className={iconClassName} />;
    case 'spreadsheet':
      return <FileSpreadsheet className={iconClassName} />;
    default:
      return <File className={iconClassName} />;
  }
}

function getResourceTypeLabel(type?: string, extension?: string): string {
  switch (type) {
    case 'document':
      return 'Documento' + (extension ? ` (.${extension})` : '');
    case 'infographic':
      return 'Infografía' + (extension ? ` (.${extension})` : '');
    case 'presentation':
      return 'Presentación' + (extension ? ` (.${extension})` : '');
    case 'spreadsheet':
      return 'Hoja de cálculo' + (extension ? ` (.${extension})` : '');
    default:
      return 'Archivo' + (extension ? ` (.${extension})` : '');
  }
}
