
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentType } from "@/types/content";
import { UseFormReturn } from "react-hook-form";

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
      <FormField
        control={form.control}
        name="videoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">URL del video (YouTube, Vimeo, etc.)</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} className="border-club-beige-dark focus:border-club-orange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
