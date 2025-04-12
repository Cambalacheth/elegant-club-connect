
import { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Upload, RefreshCw, CheckCircle, Link as LinkIcon } from "lucide-react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { useFileUpload } from "./useFileUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResourceFileUploadProps {
  field: ControllerRenderProps<any, "resourceUrl">;
  form: UseFormReturn<any>;
}

export const ResourceFileUpload = ({ field, form }: ResourceFileUploadProps) => {
  const { 
    isUploading, 
    uploadStatus, 
    handleFileUpload,
    retryCount
  } = useFileUpload({ form });

  const [showRetryTips, setShowRetryTips] = useState(false);
  const [isManualInput, setIsManualInput] = useState(!!field.value && !field.value.includes("supabase"));

  // Helper to determine if there's an error or success in the upload status
  const hasError = uploadStatus?.includes('Error') || uploadStatus?.includes('error');
  const hasSuccess = uploadStatus?.includes('éxito') || uploadStatus?.includes('success');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
    if (e.target.value) {
      setIsManualInput(true);
    }
  };

  return (
    <FormItem>
      <FormLabel className="text-club-brown font-medium">Recurso</FormLabel>
      <div className="space-y-2">
        <FormControl>
          <Input 
            placeholder="https://... o sube un archivo" 
            {...field} 
            onChange={handleUrlChange}
            className={`border-club-beige-dark focus:border-club-orange ${hasError ? 'border-red-300' : hasSuccess ? 'border-green-300' : ''}`}
          />
        </FormControl>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant={hasError ? "destructive" : hasSuccess ? "default" : "outline"}
            size="sm"
            className={`cursor-pointer transition-all duration-200 ${hasSuccess ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : hasError ? (
              <AlertTriangle className="h-4 w-4 mr-2" />
            ) : hasSuccess ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isUploading ? 'Subiendo...' : hasError ? 'Reintentar' : hasSuccess ? 'Archivo subido' : 'Subir archivo'}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={() => setIsManualInput(true)}
          >
            <LinkIcon className="h-4 w-4 mr-1" />
            Usar URL externa
          </Button>
          
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg,.webp,.zip,.rar,.7z,.txt,.rtf,.csv,.mp4,.mp3,.wav,.ogg"
            disabled={isUploading}
          />
          
          {field.value && !isUploading && !hasError && (
            <div className="flex items-center text-sm text-green-600">
              <FileText className="h-4 w-4 mr-1" />
              {isManualInput ? 'URL externa' : 'Archivo adjunto'}
            </div>
          )}
          
          {hasError && retryCount > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
              onClick={() => setShowRetryTips(!showRetryTips)}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              {showRetryTips ? "Ocultar consejos" : "Ver consejos"}
            </Button>
          )}
        </div>
        
        {showRetryTips && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTitle className="text-amber-800 font-medium">Consejos para resolver problemas de carga</AlertTitle>
            <AlertDescription className="text-sm text-amber-800">
              <p className="mt-1">Puedes intentar:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Usa una URL externa en lugar de subir un archivo</li>
                <li>Intenta con un archivo más pequeño (menos de 5MB)</li>
                <li>Espera unos segundos e intenta nuevamente</li>
                <li>Prueba con otro formato de archivo</li>
                <li>Intenta refrescar la página y luego intentar nuevamente</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {uploadStatus && (
          <div className={`text-sm p-2 rounded ${hasError ? 'text-red-600 bg-red-50 border border-red-100' : hasSuccess ? 'text-green-600 bg-green-50 border border-green-100' : 'text-blue-600 bg-blue-50 border border-blue-100'}`}>
            {uploadStatus}
          </div>
        )}
      </div>
      <FormMessage />
      <p className="text-xs text-gray-500 mt-1">
        Sube un archivo (PDF, Word, Excel, PowerPoint, imagen, ZIP, audio, video) o ingresa una URL externa
      </p>
    </FormItem>
  );
};
