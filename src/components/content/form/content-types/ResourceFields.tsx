
import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface ResourceFieldsProps {
  form: UseFormReturn<any>;
}

export const ResourceFields = ({ form }: ResourceFieldsProps) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const validFileTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/msword', // doc
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
      'application/vnd.ms-powerpoint' // ppt
    ];
    
    if (!validFileTypes.includes(file.type)) {
      setUploadStatus('Tipo de archivo no válido. Por favor, sube un archivo PDF, Word, Excel o PowerPoint.');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadStatus('Subiendo archivo...');
      
      // Create safe filename by removing spaces and special characters
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${safeFileName}`;
      
      // Import and use the uploadToResourcesBucket function
      const { uploadToResourcesBucket } = await import('@/services/storageService');
      const publicUrl = await uploadToResourcesBucket(file, fileName);
      
      // Set form values
      form.setValue('resourceUrl', publicUrl);
      setUploadStatus('Archivo subido con éxito: ' + file.name);
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadStatus(`Error al subir el archivo: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="resourceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Tipo de recurso</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-club-beige-dark focus:border-club-orange">
                  <SelectValue placeholder="Selecciona el tipo de recurso" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="tool">Herramienta</SelectItem>
                <SelectItem value="book">Libro</SelectItem>
                <SelectItem value="course">Curso</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="document">Documento</SelectItem>
                <SelectItem value="presentation">Presentación</SelectItem>
                <SelectItem value="spreadsheet">Hoja de cálculo</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Descripción</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descripción del recurso" 
                className="min-h-[100px] border-club-beige-dark focus:border-club-orange" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="resourceUrl"
        render={({ field }) => (
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
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Subiendo...' : 'Subir archivo'}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  disabled={isUploading}
                />
                {form.watch('resourceUrl') && !isUploading && (
                  <div className="flex items-center text-sm text-green-600">
                    <FileText className="h-4 w-4 mr-1" />
                    Archivo adjunto
                  </div>
                )}
              </div>
              
              {uploadStatus && (
                <div className={`text-sm ${uploadStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {uploadStatus}
                </div>
              )}
            </div>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-1">
              Sube un archivo (PDF, Word, Excel, PowerPoint) o ingresa una URL externa
            </p>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="source"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Fuente o autor</FormLabel>
            <FormControl>
              <Input 
                placeholder="Autor o creador del recurso" 
                {...field} 
                className="border-club-beige-dark focus:border-club-orange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Precio</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-club-beige-dark focus:border-club-orange">
                  <SelectValue placeholder="Selecciona el tipo de precio" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="free">Gratuito</SelectItem>
                <SelectItem value="freemium">Freemium</SelectItem>
                <SelectItem value="paid">De pago</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
