import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentType } from "@/types/content";
import { UseFormReturn } from "react-hook-form";
import { extractYoutubeVideoId } from "@/services/contentService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContentTypeFieldsProps {
  form: UseFormReturn<any>;
  contentType: ContentType;
}

export const ContentTypeFields = ({ form, contentType }: ContentTypeFieldsProps) => {
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
      
      // Create resources bucket if it doesn't exist
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `resources/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('resources')
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);
      
      // Set form values
      form.setValue('resourceUrl', publicUrlData.publicUrl);
      setUploadStatus('Archivo subido con éxito: ' + file.name);
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadStatus(`Error al subir el archivo: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  if (contentType === 'article') {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Cuerpo del texto</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Contenido completo del artículo" 
                  className="min-h-[200px] border-club-beige-dark focus:border-club-orange" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
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
                  placeholder="Nombre de la fuente o autor original" 
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
          name="externalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Enlace externo (si aplica)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://..." 
                  {...field} 
                  className="border-club-beige-dark focus:border-club-orange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  } 
  
  if (contentType === 'video') {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Enlace al video (YouTube)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://youtube.com/watch?v=..." 
                  {...field} 
                  className="border-club-beige-dark focus:border-club-orange"
                  onBlur={(e) => {
                    const videoId = extractYoutubeVideoId(e.target.value);
                    if (videoId && !form.getValues('imageUrl')) {
                      form.setValue('imageUrl', `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                    }
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-club-brown/70 mt-1">
                Soporta enlaces de YouTube como: youtube.com/watch, youtu.be/ y youtube.com/shorts
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Descripción breve</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Breve descripción del video" 
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
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Fuente o autor</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Canal o autor del video" 
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
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Duración (opcional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej: 10:30" 
                  {...field} 
                  className="border-club-beige-dark focus:border-club-orange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch('videoUrl') && extractYoutubeVideoId(form.watch('videoUrl')) && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-club-brown mb-2">Vista previa:</h4>
            <div className="aspect-video rounded-md overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${extractYoutubeVideoId(form.watch('videoUrl'))}`}
                title="YouTube Preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (contentType === 'guide') {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Descripción o introducción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Introducción de la guía" 
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Contenido principal</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Contenido detallado de la guía" 
                  className="min-h-[250px] border-club-beige-dark focus:border-club-orange" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Nivel de dificultad</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-club-beige-dark focus:border-club-orange">
                    <SelectValue placeholder="Selecciona el nivel de dificultad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
                  placeholder="Autor o creador de la guía" 
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
          name="downloadUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">Enlace externo o descarga</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://..." 
                  {...field} 
                  className="border-club-beige-dark focus:border-club-orange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  // Resource type
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
