
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ContentItem, ContentType } from "@/types/content";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";

interface ContentFormProps {
  initialData?: Partial<ContentItem>;
  onSubmit: (data: Partial<ContentItem>) => Promise<void>;
  isSubmitting: boolean;
  contentType: ContentType;
  userId: string;
}

export const ContentForm = ({ 
  initialData, 
  onSubmit, 
  isSubmitting, 
  contentType,
  userId 
}: ContentFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  
  const categories = ["General", "Legal", "Tecnología", "Finanzas", "Salud", "Audiovisual", "Eventos"];
  
  const form = useForm<Partial<ContentItem>>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      category: initialData?.category || "General",
      videoUrl: initialData?.videoUrl || "",
      resourceUrl: initialData?.resourceUrl || "",
      published: initialData?.published ?? false,
      type: contentType,
      author_id: userId
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: Partial<ContentItem>) => {
    // In a real implementation, you would upload the image to Supabase Storage here
    // and get the URL to save with the content
    await onSubmit({
      ...data,
      imageUrl: imagePreview || "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2232&auto=format&fit=crop", // Default image for demo
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-club-brown">
          {initialData?.id ? `Editar ${contentType === 'article' ? 'artículo' : contentType === 'video' ? 'video' : contentType === 'guide' ? 'guía' : 'recurso'}` : `Crear nuevo ${contentType === 'article' ? 'artículo' : contentType === 'video' ? 'video' : contentType === 'guide' ? 'guía' : 'recurso'}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título del contenido" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Breve descripción del contenido" 
                      className="resize-none" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label htmlFor="image">Imagen de portada</Label>
              <div className="flex flex-col items-center gap-4">
                {imagePreview && (
                  <div className="w-full h-48 overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {contentType === 'article' || contentType === 'guide' ? (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Contenido completo" 
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : contentType === 'video' ? (
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del video (YouTube, Vimeo, etc.)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="resourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del recurso</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publicar</FormLabel>
                    <p className="text-sm text-gray-500">
                      {field.value 
                        ? "El contenido será visible para todos los usuarios" 
                        : "El contenido será solo visible para administradores"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-end p-0">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-club-orange hover:bg-club-terracotta text-white"
              >
                {isSubmitting 
                  ? "Guardando..." 
                  : initialData?.id 
                    ? "Actualizar" 
                    : "Crear"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
