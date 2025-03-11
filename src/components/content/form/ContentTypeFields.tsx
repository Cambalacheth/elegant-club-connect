
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentType } from "@/types/content";
import { UseFormReturn } from "react-hook-form";
import { extractYoutubeVideoId } from "@/services/contentService";

interface ContentTypeFieldsProps {
  form: UseFormReturn<any>;
  contentType: ContentType;
}

export const ContentTypeFields = ({ form, contentType }: ContentTypeFieldsProps) => {
  if (contentType === 'article' || contentType === 'guide') {
    return (
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Contenido</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Contenido completo" 
                className="min-h-[200px] border-club-beige-dark focus:border-club-orange" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  } 
  
  if (contentType === 'video') {
    return (
      <>
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-brown font-medium">URL del video (YouTube)</FormLabel>
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
      </>
    );
  }

  // Default case: resource
  return (
    <FormField
      control={form.control}
      name="resourceUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-club-brown font-medium">URL del recurso</FormLabel>
          <FormControl>
            <Input placeholder="https://..." {...field} className="border-club-beige-dark focus:border-club-orange" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
