
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

interface ContentTypeFieldsProps {
  form: UseFormReturn<any>;
  contentType: ContentType;
}

export const ContentTypeFields = ({ form, contentType }: ContentTypeFieldsProps) => {
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
                    // Extract video ID on blur and update the thumbnail if no image is set
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
            <FormLabel className="text-club-brown font-medium">Enlace al recurso o descarga</FormLabel>
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
