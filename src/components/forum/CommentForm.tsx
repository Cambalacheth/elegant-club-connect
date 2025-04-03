
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserRole, canCreateContent } from "@/types/user";

interface CommentFormProps {
  debateId: string;
  userRole: UserRole;
  userId?: string;
  onSubmit: (debateId: string, content: string) => Promise<void>;
}

const CommentForm = ({ debateId, userRole, userId, onSubmit }: CommentFormProps) => {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para comentar",
        variant: "destructive",
      });
      return;
    }

    if (!canCreateContent(userRole)) {
      toast({
        title: "Acceso denegado",
        description: "Necesitas ser nivel 2 o superior para comentar",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Contenido requerido",
        description: "Por favor, escribe un comentario",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(debateId, content);
      setContent("");
      toast({
        title: "Comentario publicado",
        description: "Tu comentario ha sido publicado con éxito",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "No se pudo publicar el comentario",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-club-brown mb-3">Añadir un comentario</h3>
      
      {!canCreateContent(userRole) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md mb-4">
          Necesitas ser nivel 2 o superior para comentar. Continúa participando para subir de nivel.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu comentario"
            rows={3}
            disabled={!canCreateContent(userRole) || isSubmitting}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!canCreateContent(userRole) || isSubmitting}
          className="bg-club-orange hover:bg-club-terracotta text-white"
        >
          {isSubmitting ? "Publicando..." : "Publicar comentario"}
        </Button>
      </form>
    </div>
  );
};

export default CommentForm;
