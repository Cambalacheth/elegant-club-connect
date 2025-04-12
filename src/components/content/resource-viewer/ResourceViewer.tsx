
import { useEffect, useState } from "react";
import { ExternalStorageViewer } from "./viewers/ExternalStorageViewer";
import { PresentationViewer } from "./viewers/PresentationViewer";
import { PDFViewer } from "./viewers/PDFViewer";
import { ImageViewer } from "./viewers/ImageViewer";
import { DefaultResourceViewer } from "./viewers/DefaultResourceViewer";
import { 
  isImageResource, 
  isPresentationResource, 
  isPDFResource, 
  isExternalStorageLink,
  getResourceTypeFromExtension 
} from "./utils/resourceTypeUtils";

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
    return <ImageViewer url={url} />;
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
