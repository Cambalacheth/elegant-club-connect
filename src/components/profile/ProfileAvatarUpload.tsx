
import { useState } from "react";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarUploadProps {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  setAvatarFile: (file: File | null) => void;
  currentLanguage: string;
}

const ProfileAvatarUpload = ({
  avatarUrl,
  setAvatarUrl,
  setAvatarFile,
  currentLanguage
}: ProfileAvatarUploadProps) => {
  const { toast } = useToast();
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: currentLanguage === "en" ? "File too large" : "Archivo demasiado grande",
        description: currentLanguage === "en"
          ? "Image must be less than 2MB"
          : "La imagen debe ser menor a 2MB",
        variant: "destructive",
      });
      return;
    }

    setAvatarFile(file);
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-club-olive/30 flex items-center justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={48} className="text-club-brown" />
        )}
      </div>
      <div className="flex-1">
        <FormLabel>{currentLanguage === "en" ? "Profile Picture" : "Foto de Perfil"}</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-club-beige file:text-club-brown hover:file:bg-club-beige/80"
        />
      </div>
    </div>
  );
};

export default ProfileAvatarUpload;
