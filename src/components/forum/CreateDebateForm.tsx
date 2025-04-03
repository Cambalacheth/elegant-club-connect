
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserRole, canCreateContent, canCreateForum } from "@/types/user";

interface CreateDebateFormProps {
  userRole: UserRole;
  userId?: string;
  onSubmit: (title: string, content: string, category: string) => Promise<void>;
}

const CreateDebateForm = ({ userRole, userId, onSubmit }: CreateDebateFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["General", "Legal", "Tecnología", "Finanzas", "Salud", "Audiovisual", "Eventos"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para crear debates",
        variant: "destructive",
      });
      return;
    }

    if (!canCreateForum(userRole)) {
      toast({
        title: "Acceso denegado",
        description: "Necesitas ser nivel 4 o superior para crear debates",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Título requerido",
        description: "Por favor, ingresa un título para el debate",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Contenido requerido",
        description: "Por favor, ingresa el contenido del debate",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(title, content, category);
      setTitle("");
      setContent("");
      setCategory("General");
      toast({
        title: "Debate creado",
        description: "Tu debate ha sido publicado con éxito",
      });
    } catch (error) {
      console.error("Error creating debate:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el debate",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold text-club-brown mb-4">Crear nuevo debate</h2>
      
      {!canCreateForum(userRole) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md mb-4">
          Necesitas ser nivel 4 o superior para crear debates. Continúa participando para subir de nivel.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="debateTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <Input
            id="debateTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe un título para tu debate"
            disabled={!canCreateForum(userRole) || isSubmitting}
            maxLength={100}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="debateCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <Select 
            value={category} 
            onValueChange={setCategory}
            disabled={!canCreateContent(userRole) || isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="debateContent" className="block text-sm font-medium text-gray-700 mb-1">
            Contenido
          </label>
          <Textarea
            id="debateContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe el contenido de tu debate"
            rows={5}
            disabled={!canCreateContent(userRole) || isSubmitting}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!canCreateForum(userRole) || isSubmitting}
          className="w-full bg-club-orange hover:bg-club-terracotta text-white"
        >
          {isSubmitting ? "Publicando..." : "Publicar debate"}
        </Button>
      </form>
    </div>
  );
};

export default CreateDebateForm;
