
import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useForumUser } from "@/hooks/useForumUser";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProjectSubmitModalProps {
  onClose: () => void;
  onSubmitted: () => void;
  language: string;
}

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  description: z.string().max(220, {
    message: "Description cannot exceed 220 characters.",
  }),
  long_description: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  social_links: z.string().optional(),
  categories: z.array(z.string()).min(1, {
    message: "Select at least one category",
  }),
  tags: z.string().optional(),
});

const ProjectSubmitModal = ({ onClose, onSubmitted, language }: ProjectSubmitModalProps) => {
  const { user } = useForumUser();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      long_description: "",
      website_url: "",
      social_links: "",
      categories: ["Tecnología"],
      tags: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: language === "en" ? "File too large" : "Archivo demasiado grande",
        description: language === "en" 
          ? "Image must be less than 2MB" 
          : "La imagen debe ser menor a 2MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) return;
    setIsUploading(true);

    try {
      // Process tags
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').slice(0, 6) 
        : [];

      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        // Check if storage bucket exists, if not create it
        const { data: buckets } = await supabase.storage.listBuckets();
        const projectsBucket = buckets?.find(bucket => bucket.name === 'projects');
        
        if (!projectsBucket) {
          await supabase.storage.createBucket('projects', { public: true });
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('projects')
          .upload(fileName, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // Submit project with primary category as the first one in the array
      const { error } = await supabase.from('projects').insert({
        profile_id: user.id,
        name: values.name,
        description: values.description,
        long_description: values.long_description,
        website_url: values.website_url || null,
        image_url: imageUrl,
        category: values.categories[0], // Keep primary category for backward compatibility
        categories: values.categories, // Store all selected categories
        tags: tagsArray,
      });

      if (error) throw error;

      onSubmitted();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "There was an error submitting your project" 
          : "Hubo un error al enviar tu proyecto",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Text based on selected language
  const modalTitle = language === "en" ? "Submit Project" : "Enviar Proyecto";
  const submitButtonText = language === "en" ? "Submit" : "Enviar";
  const cancelButtonText = language === "en" ? "Cancel" : "Cancelar";
  const uploadImageText = language === "en" ? "Upload Image" : "Subir Imagen";
  const imagePreviewText = language === "en" ? "Image Preview" : "Vista previa de la imagen";
  const categoriesLabel = language === "en" ? "Categories" : "Categorías"; // Updated to plural
  const nameLabel = language === "en" ? "Project Name" : "Nombre del Proyecto";
  const shortDescLabel = language === "en" ? "Short Description (max 220 chars)" : "Descripción Corta (máx 220 caracteres)";
  const longDescLabel = language === "en" ? "Long Description" : "Descripción Larga";
  const websiteLabel = language === "en" ? "Website URL (optional)" : "URL del Sitio Web (opcional)";
  const tagsLabel = language === "en" ? "Tags (comma separated, max 6)" : "Tags (separados por comas, máx 6)";
  const selectCategoriesText = language === "en" ? "Select at least one category" : "Selecciona al menos una categoría";
  
  // Categories
  const categoriesOptions = [
    { id: "Legal", label: language === "en" ? "Legal" : "Legal" },
    { id: "Tecnología", label: language === "en" ? "Technology" : "Tecnología" },
    { id: "Finanzas", label: language === "en" ? "Finance" : "Finanzas" },
    { id: "Audiovisual", label: language === "en" ? "Audiovisual" : "Audiovisual" },
    { id: "Comunidad", label: language === "en" ? "Community" : "Comunidad" },
    { id: "Salud", label: language === "en" ? "Health" : "Salud" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-serif text-club-brown">{modalTitle}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{nameLabel}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="categories"
                  render={() => (
                    <FormItem>
                      <FormLabel>{categoriesLabel}</FormLabel>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {selectCategoriesText}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {categoriesOptions.map((category) => (
                            <FormField
                              key={category.id}
                              control={form.control}
                              name="categories"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={category.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(category.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, category.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== category.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {category.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tagsLabel}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="tech, web, app" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{shortDescLabel}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="long_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{longDescLabel}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{websiteLabel}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://yourproject.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormLabel>{uploadImageText}</FormLabel>
                <div className="mt-1 flex flex-col space-y-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-club-beige file:text-club-brown hover:file:bg-club-beige/80"
                  />
                  
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">{imagePreviewText}:</p>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-h-48 object-cover rounded-lg shadow" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isUploading}
              >
                {cancelButtonText}
              </Button>
              <Button 
                type="submit"
                className="bg-club-orange hover:bg-club-terracotta text-white"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "en" ? "Uploading..." : "Subiendo..."}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProjectSubmitModal;
