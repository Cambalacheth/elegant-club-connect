
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
import { FileText, Video, BookOpen, Newspaper } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  const defaultValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    category: initialData?.category || "General",
    videoUrl: initialData?.videoUrl || "",
    resourceUrl: initialData?.resourceUrl || "",
    source: initialData?.source || "",
    externalUrl: initialData?.externalUrl || "",
    duration: initialData?.duration || "",
    difficulty: initialData?.difficulty || "basic",
    downloadUrl: initialData?.downloadUrl || "",
    resourceType: initialData?.resourceType || "tool",
    price: initialData?.price || "free",
    published: initialData?.published ?? false,
    type: contentType,
    author_id: userId
  };
  
  const form = useForm<Partial<ContentItem>>({
    defaultValues
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
  
  // Get icon for content type
  const getContentTypeIcon = () => {
    switch(contentType) {
      case 'article': return <FileText className="h-5 w-5 mr-2" />;
      case 'video': return <Video className="h-5 w-5 mr-2" />;
      case 'guide': return <BookOpen className="h-5 w-5 mr-2" />;
      case 'resource': return <Newspaper className="h-5 w-5 mr-2" />;
      default: return <FileText className="h-5 w-5 mr-2" />;
    }
  };
  
  // Get color for content type
  const getContentTypeColor = () => {
    switch(contentType) {
      case 'article': return "from-blue-500 to-blue-700";
      case 'video': return "from-red-500 to-red-700";
      case 'guide': return "from-green-500 to-green-700";
      case 'resource': return "from-purple-500 to-purple-700";
      default: return "from-club-orange to-club-terracotta";
    }
  };
  
  // Get description for content type
  const getContentTypeDescription = () => {
    switch(contentType) {
      case 'article': 
        return "Crea un artículo informativo con texto formateado, imágenes y enlaces.";
      case 'video': 
        return "Comparte un video de YouTube o similar con una descripción y metadatos.";
      case 'guide': 
        return "Crea una guía paso a paso o tutorial sobre algún tema.";
      case 'resource': 
        return "Comparte una herramienta, plantilla, curso u otro recurso útil.";
      default: 
        return "";
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className={`bg-gradient-to-r ${getContentTypeColor()} text-white rounded-t-lg py-5`}>
        <DialogTitle className="text-xl font-semibold flex items-center">
          {getContentTypeIcon()}
          {getFormTitle()}
        </DialogTitle>
        <p className="text-white/80 text-sm mt-1">{getContentTypeDescription()}</p>
      </CardHeader>
      <ScrollArea className="h-[calc(80vh-120px)]">
        <CardContent className="p-6 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      {getContentTypeIcon()}
                      Información básica
                    </h3>
                    <BasicInfoFields form={form} categories={categories} />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Detalles específicos</h3>
                    <ContentTypeFields form={form} contentType={contentType} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Imagen destacada</h3>
                    <ImageUploadField 
                      initialImage={initialData?.imageUrl} 
                      onChange={(url) => setImagePreview(url)} 
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Publicación</h3>
                    <PublishSwitch form={form} />
                    <p className="text-sm text-gray-500 mt-2">
                      {form.watch('published') 
                        ? 'Este contenido será visible para todos los usuarios.' 
                        : 'Este contenido quedará guardado como borrador.'}
                    </p>
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-end p-0 pt-4 border-t mt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r ${getContentTypeColor()} hover:opacity-90 text-white font-medium shadow-md transition-all`}
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
      </ScrollArea>
    </Card>
  );
};
