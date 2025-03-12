
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ProjectForm from './ProjectForm';
import { User } from '@supabase/supabase-js';

interface NewProjectButtonProps {
  user: User | null;
  language: string;
}

const NewProjectButton = ({ user, language }: NewProjectButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageChange = (file: File | null) => {
    setProjectImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (values: any) => {
    setIsUploading(true);
    try {
      // Project submission logic would go here
      toast({
        title: "Éxito",
        description: "Proyecto enviado para aprobación",
      });
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el proyecto",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setImagePreview(null);
    setProjectImage(null);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-club-orange hover:bg-club-terracotta text-white"
        >
          <Plus className="w-5 h-5 mr-2" /> Nuevo proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          language={language}
          isUploading={isUploading}
          projectToEdit={null}
          imagePreview={imagePreview}
          existingImageUrl={null}
          onImageChange={handleImageChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectButton;
