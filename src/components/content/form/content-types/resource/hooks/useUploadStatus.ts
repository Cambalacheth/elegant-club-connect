
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseUploadStatusResult {
  uploadStatus: string | null;
  isUploading: boolean;
  retryCount: number;
  setUploadStatus: (status: string | null) => void;
  setIsUploading: (isUploading: boolean) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  notifyUploadStarted: () => void;
  notifyUploadSuccess: (fileName: string) => void;
  notifyUploadError: (error: Error) => void;
  notifyPermissionError: () => void;
}

export const useUploadStatus = (): UseUploadStatusResult => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const incrementRetryCount = () => {
    setRetryCount(prev => prev + 1);
  };

  const resetRetryCount = () => {
    setRetryCount(0);
  };

  const notifyUploadStarted = () => {
    setUploadStatus('Subiendo archivo...');
    toast({
      title: "Subiendo archivo",
      description: "Por favor espera mientras se sube el archivo...",
      variant: "default",
    });
  };

  const notifyUploadSuccess = (fileName: string) => {
    setUploadStatus('Archivo subido con éxito: ' + fileName);
    toast({
      title: "Archivo subido con éxito",
      description: fileName,
      variant: "default",
    });
  };

  const notifyUploadError = (error: Error) => {
    setUploadStatus(`Error al subir el archivo: ${error.message || 'Error desconocido'}`);
    toast({
      title: "Error al subir el archivo",
      description: error.message || "Error desconocido",
      variant: "destructive",
    });
  };

  const notifyPermissionError = () => {
    setUploadStatus('Error de permisos: Intentando resolver el problema automáticamente, por favor intenta de nuevo en unos segundos.');
    toast({
      title: "Error de permisos",
      description: "Intentaremos resolver este problema automáticamente, por favor intenta de nuevo.",
      variant: "destructive",
    });
    
    // Wait a moment before suggesting retry
    setTimeout(() => {
      toast({
        title: "Reintentar subida",
        description: "Por favor intenta subir el archivo nuevamente.",
        variant: "default",
      });
    }, 3000);
  };

  return {
    uploadStatus,
    isUploading,
    retryCount,
    setUploadStatus,
    setIsUploading,
    incrementRetryCount,
    resetRetryCount,
    notifyUploadStarted,
    notifyUploadSuccess,
    notifyUploadError,
    notifyPermissionError
  };
};
