
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileImage, Presentation, FileSpreadsheet, File } from "lucide-react";

interface DefaultResourceViewerProps {
  url: string;
  type?: string;
  extension?: string;
}

export const DefaultResourceViewer = ({ 
  url, 
  type, 
  extension 
}: DefaultResourceViewerProps) => {
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
