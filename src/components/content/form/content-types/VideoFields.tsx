
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { extractYoutubeVideoId } from "@/services/contentService";

interface VideoFieldsProps {
  form: UseFormReturn<any>;
}

export const VideoFields = ({ form }: VideoFieldsProps) => {
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
};
