
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormButtonsProps {
  onCancel: () => void;
  isUploading: boolean;
  isEditing: boolean;
  language: string;
}

const FormButtons = ({
  onCancel,
  isUploading,
  isEditing,
  language,
}: FormButtonsProps) => {
  // Text based on selected language
  const submitButtonText = isEditing
    ? (language === "en" ? "Update" : "Actualizar")
    : (language === "en" ? "Submit" : "Enviar");
  const cancelButtonText = language === "en" ? "Cancel" : "Cancelar";

  return (
    <div className="flex justify-end gap-4 pt-4 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
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
  );
};

export default FormButtons;
