
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
  const [slideUrls, setSlideUrls] = useState<string[]>([]);
  const fileExtension = url.split('.').pop()?.toLowerCase();
  const resourceType = type || getResourceTypeFromExtension(fileExtension);
  
  useEffect(() => {
    // Reset loading state when the URL changes
    setIsLoading(true);
    setSlideUrls([]);
    
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
  
  // Special handling for external links (like Google Drive, OneDrive)
  if (isExternalStorageLink(url)) {
    return <ExternalStorageViewer url={url} type={resourceType} />;
  }
  
  // Default fallback for other file types
  return <DefaultResourceViewer url={url} type={resourceType} extension={fileExtension} />;
};

// External storage link viewer (Google Drive, OneDrive, etc.)
const ExternalStorageViewer = ({ url, type }: { url: string; type?: string }) => {
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

// Presentación viewer (PowerPoint files)
const PresentationViewer = ({ url }: { url: string }) => {
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
  return ['ppt', 'pptx'].includes(extension || '') || 
         (type === 'presentation') ||
         isGoogleSlidesUrl(type || '');
}

function isPDFResource(type?: string, extension?: string): boolean {
  if (type === 'document' && extension === 'pdf') return true;
  return extension === 'pdf';
}

function isExternalStorageLink(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('drive.google.com') || 
         lowerUrl.includes('docs.google.com') || 
         lowerUrl.includes('onedrive.live.com') ||
         lowerUrl.includes('dropbox.com');
}

function isGoogleSlidesUrl(url: string): boolean {
  return url.includes('docs.google.com/presentation');
}

function getEmbedUrl(url: string): string | null {
  // Google Drive file link to preview embed
  if (url.includes('drive.google.com/file/d/')) {
    const fileIdMatch = url.match(/\/d\/([^\/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }
  
  // Google Drive folder to embed
  if (url.includes('drive.google.com/drive/folders/')) {
    const folderIdMatch = url.match(/\/folders\/([^\/]+)/);
    if (folderIdMatch && folderIdMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${folderIdMatch[1]}#list`;
    }
  }
  
  // Google Slides
  if (url.includes('docs.google.com/presentation')) {
    return url.replace(/\/edit.*$/, '/embed');
  }
  
  // For other services, you might need to implement similar conversions
  return null;
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
