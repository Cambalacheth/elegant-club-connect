
import { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Upload, RefreshCw } from "lucide-react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { useFileUpload } from "./useFileUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Helper to determine if there's an error in the upload status
  const hasError = uploadStatus?.includes('Error');

  return (
    <FormItem>
      <FormLabel className="text-club-brown font-medium">Recurso</FormLabel>
      <div className="space-y-2">
        <FormControl>
          <Input 
            placeholder="https://... o sube un archivo" 
            {...field} 
            className="border-club-beige-dark focus:border-club-orange"
          />
        </FormControl>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant={hasError ? "destructive" : "outline"}
            size="sm"
            className="cursor-pointer transition-all duration-200"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
          >
            {hasError ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isUploading ? 'Subiendo...' : hasError ? 'Reintentar' : 'Subir archivo'}
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg,.webp,.zip,.rar,.7z,.txt,.rtf,.csv"
            disabled={isUploading}
          />
          {form.watch('resourceUrl') && !isUploading && !hasError && (
            <div className="flex items-center text-sm text-green-600">
              <FileText className="h-4 w-4 mr-1" />
              Archivo adjunto
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
            <AlertDescription className="text-sm text-amber-800">
              <p className="font-medium">Consejos para resolver problemas de carga:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Asegúrate de estar conectado con una cuenta que tenga permisos suficientes.</li>
                <li>Intenta con un archivo más pequeño (menos de 5MB).</li>
                <li>Espera unos segundos e intenta nuevamente.</li>
                <li>Prueba con otro formato de archivo.</li>
                <li>Si continúa el problema, puedes ingresar una URL externa en su lugar.</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {uploadStatus && (
          <div className={`text-sm p-2 rounded ${hasError ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}`}>
            {uploadStatus}
          </div>
        )}
      </div>
      <FormMessage />
      <p className="text-xs text-gray-500 mt-1">
        Sube un archivo (PDF, Word, Excel, PowerPoint, imagen, ZIP) o ingresa una URL externa
      </p>
    </FormItem>
  );
};
