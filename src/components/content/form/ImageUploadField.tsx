
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadFieldProps {
  initialImage?: string | null;
  onChange: (imageUrl: string | null) => void;
}

export const ImageUploadField = ({ initialImage, onChange }: ImageUploadFieldProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPreview = event.target?.result as string;
        setImagePreview(newPreview);
        onChange(newPreview);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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
  );
};
