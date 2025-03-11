
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

  // Get form title based on content type and edit mode
  const getFormTitle = () => {
    const action = initialData?.id ? 'Editar' : 'Crear nuevo';
    let typeName = '';
    switch(contentType) {
      case 'article': typeName = 'artículo'; break;
      case 'video': typeName = 'video'; break;
      case 'guide': typeName = 'guía'; break;
      case 'resource': typeName = 'recurso'; break;
    }
    return `${action} ${typeName}`;
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="bg-gradient-to-r from-club-orange/90 to-club-terracotta/90 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold">
          {getFormTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-club-brown font-medium">Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título del contenido" {...field} className="border-club-beige-dark focus:border-club-orange" />
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
                      <FormLabel className="text-club-brown font-medium">Categoría</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-club-beige-dark focus:border-club-orange">
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
                      <FormLabel className="text-club-brown font-medium">Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Breve descripción del contenido" 
                          className="resize-none border-club-beige-dark focus:border-club-orange" 
                          rows={3} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {contentType === 'article' || contentType === 'guide' ? (
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
                ) : contentType === 'video' ? (
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
                ) : (
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
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="image" className="text-club-brown font-medium">Imagen de portada</Label>
                  <div className="flex flex-col items-center gap-4">
                    {imagePreview ? (
                      <div className="w-full h-48 overflow-hidden rounded-md border border-club-beige-dark">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center rounded-md border border-dashed border-club-beige-dark bg-gray-50">
                        <span className="text-club-gray text-sm">Vista previa de la imagen</span>
                      </div>
                    )}
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="cursor-pointer border-club-beige-dark"
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-club-beige-dark bg-club-beige/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-club-brown font-medium">Publicar</FormLabel>
                        <p className="text-sm text-club-gray">
                          {field.value 
                            ? "El contenido será visible para todos los usuarios" 
                            : "El contenido será solo visible para administradores"}
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-club-orange"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CardFooter className="flex justify-end p-0 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-club-orange to-club-terracotta hover:opacity-90 text-white font-medium shadow-md transition-all"
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
