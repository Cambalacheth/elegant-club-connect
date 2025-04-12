
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isValidFileType, isValidFileSize } from "@/utils/fileUtils";

interface UseFileValidationResult {
  validateFile: (file: File) => boolean;
  validationError: string | null;
}

export const useFileValidation = (): UseFileValidationResult => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Clear previous validation errors
    setValidationError(null);
    
    // Check file type
    if (!isValidFileType(file.type)) {
      const errorMsg = 'Tipo de archivo no válido. Por favor, sube un archivo compatible (documento, imagen o archivo comprimido).';
      setValidationError(errorMsg);
      toast({
        title: "Tipo de archivo no válido",
        description: "Por favor, sube un archivo compatible (documento, imagen o archivo comprimido).",
        variant: "destructive",
      });
      return false;
    }
    
    // Check file size (max 10MB)
    if (!isValidFileSize(file.size)) {
      const errorMsg = 'El archivo es demasiado grande. El tamaño máximo es 10MB.';
      setValidationError(errorMsg);
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es 10MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  return {
    validateFile,
    validationError
  };
};
