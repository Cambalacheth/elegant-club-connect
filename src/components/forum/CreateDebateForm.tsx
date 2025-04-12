import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserRole, canCreateContent, canCreateForum } from "@/types/user";
import RichTextEditor from "./RichTextEditor";

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

  const canCreate = canCreateForum(userRole);

  console.log("CreateDebateForm - userRole:", userRole, "canCreateForum:", canCreate);

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

    if (!canCreate) {
      toast({
        title: "Acceso denegado",
        description: "Necesitas ser nivel 3 o superior para crear debates",
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
      
      console.log("Submitting debate - title:", title, "category:", category, "userId:", userId, "userRole:", userRole);
      
      await onSubmit(title, content, category);
      
      // Clear form fields on successful submission
      setTitle("");
      setContent("");
      setCategory("General");
      
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
      
      {!canCreate && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md mb-4">
          Necesitas ser nivel 3 o superior para crear debates. Continúa participando para subir de nivel.
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
            disabled={!canCreate || isSubmitting}
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
            disabled={!canCreate || isSubmitting}
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
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Escribe el contenido de tu debate. Puedes usar formato de texto."
            rows={5}
            disabled={!canCreate || isSubmitting}
            maxLength={5000}
          />
          <p className="text-xs text-gray-500 mt-1">
            Usa los botones para dar formato a tu texto: negrita, itálica, enlaces, etc.
          </p>
        </div>
        
        <Button 
          type="submit" 
          disabled={!canCreate || isSubmitting}
          className="w-full bg-club-orange hover:bg-club-terracotta text-white"
        >
          {isSubmitting ? "Publicando..." : "Publicar debate"}
        </Button>
      </form>
    </div>
  );
};

export default CreateDebateForm;
