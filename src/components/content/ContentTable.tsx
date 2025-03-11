
import { useState } from "react";
import { ContentItem, ContentType } from "@/types/content";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { ContentForm } from "./ContentForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ContentTableProps {
  items: ContentItem[];
  isLoading: boolean;
  onUpdate: (id: string, data: Partial<ContentItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  type: ContentType;
  userId: string;
}

export const ContentTable = ({ 
  items, 
  isLoading, 
  onUpdate, 
  onDelete,
  type,
  userId
}: ContentTableProps) => {
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (item: ContentItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (data: Partial<ContentItem>) => {
    if (!editingItem) return;
    
    try {
      setIsSubmitting(true);
      await onUpdate(editingItem.id, data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContentTypeLabel = (): string => {
    switch (type) {
      case "article": return "artículos";
      case "video": return "videos";
      case "guide": return "guías";
      case "resource": return "recursos";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-club-brown">Cargando contenido...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Alert className="bg-club-beige/30">
        <AlertTitle>No hay {getContentTypeLabel()} disponibles</AlertTitle>
        <AlertDescription>
          Comienza creando nuevo contenido para esta categoría.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                {item.published ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    <Eye className="mr-1 h-3 w-3" /> Publicado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    <EyeOff className="mr-1 h-3 w-3" /> Borrador
                  </Badge>
                )}
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(item.updated_at), { addSuffix: true, locale: es })}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditClick(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente este contenido.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingItem && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <ContentForm
              initialData={editingItem}
              onSubmit={handleUpdate}
              isSubmitting={isSubmitting}
              contentType={type}
              userId={userId}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
