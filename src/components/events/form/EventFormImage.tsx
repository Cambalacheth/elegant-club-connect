
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EventFormImageProps {
  initialImage?: string | null;
  onImageChange: (imageUrl: string | null) => void;
}

export const EventFormImage = ({ initialImage, onImageChange }: EventFormImageProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel>Imagen del evento</FormLabel>
      <div className="flex flex-col items-center gap-4">
        {imagePreview ? (
          <div className="w-full h-48 overflow-hidden rounded-md border">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 flex items-center justify-center rounded-md border border-dashed bg-gray-50">
            <span className="text-gray-500 text-sm">Vista previa de la imagen</span>
          </div>
        )}
        <Input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};
