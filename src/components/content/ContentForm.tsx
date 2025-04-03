
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ContentItem, ContentType } from "@/types/content";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContentTypeFields } from "./form/ContentTypeFields";
import { ImageUploadField } from "./form/ImageUploadField";
import { PublishSwitch } from "./form/PublishSwitch";

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

  const handleSubmit = async (data: Partial<ContentItem>) => {
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
      <CardHeader className="bg-gradient-to-r from-club-orange to-club-terracotta text-white rounded-t-lg py-5">
        <CardTitle className="text-xl font-semibold">
          {getFormTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                <BasicInfoFields form={form} categories={categories} />
                <ContentTypeFields form={form} contentType={contentType} />
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <ImageUploadField 
                    initialImage={initialData?.imageUrl} 
                    onChange={(url) => setImagePreview(url)} 
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <PublishSwitch form={form} />
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-end p-0 pt-4 border-t mt-4">
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
