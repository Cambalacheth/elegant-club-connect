
import { useState, useCallback } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useDomains } from "@/hooks/useDomains";
import { ExternalLink, Edit, Trash2, Plus, Search, RefreshCw, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 10;

const DomainManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<any>(null);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"available" | "reserved" | "used">("available");
  const [externalUrl, setExternalUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { toast } = useToast();
  const { domains, loading, totalCount, totalPages } = useDomains({
    pageSize: ITEMS_PER_PAGE,
    randomize: false
  });

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (domain.description && domain.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const resetForm = useCallback(() => {
    setName("");
    setPath("");
    setDescription("");
    setStatus("available");
    setExternalUrl("");
    setCurrentDomain(null);
    setIsEditing(false);
  }, []);

  const handleEditDomain = (domain: any) => {
    setCurrentDomain(domain);
    setName(domain.name);
    setPath(domain.path);
    setDescription(domain.description || "");
    setStatus(domain.status);
    setExternalUrl(domain.externalUrl || "");
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!name || !path) {
        toast({
          title: "Error",
          description: "Nombre y ruta son campos obligatorios",
          variant: "destructive"
        });
        return;
      }

      const domainData = {
        name,
        path: path.startsWith("/") ? path : `/${path}`,
        description,
        status,
        external_url: externalUrl || null
      };

      let result;
      
      if (isEditing && currentDomain) {
        result = await supabase
          .from("domains")
          .update(domainData)
          .eq("id", currentDomain.id);
      } else {
        result = await supabase
          .from("domains")
          .insert([domainData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Dominio actualizado" : "Dominio creado",
        description: isEditing 
          ? `El dominio ${name} ha sido actualizado correctamente.`
          : `El dominio ${name} ha sido creado correctamente.`,
      });
      
      resetForm();
      setDialogOpen(false);
      
      // Force reload domains
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error saving domain:", error);
      toast({
        title: "Error",
        description: `Ha ocurrido un error al ${isEditing ? "actualizar" : "crear"} el dominio.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDomain = async (domain: any) => {
    if (!confirm(`¿Estás seguro que deseas eliminar el dominio ${domain.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("domains")
        .delete()
        .eq("id", domain.id);

      if (error) throw error;

      toast({
        title: "Dominio eliminado",
        description: `El dominio ${domain.name} ha sido eliminado correctamente.`
      });

      // Force reload domains
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error deleting domain:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el dominio.",
        variant: "destructive"
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-amber-100 text-amber-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm border-club-beige">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-serif text-club-brown">Gestión de Dominios</CardTitle>
              <CardDescription>
                Administra los dominios disponibles en la plataforma
              </CardDescription>
            </div>
            <Button 
              onClick={handleAddNew} 
              className="bg-club-orange hover:bg-club-orange/90 text-white gap-2"
            >
              <Plus size={16} />
              Nuevo Dominio
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-club-brown/50" size={16} />
              <Input
                placeholder="Buscar dominios..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[200px]">Nombre</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead className="w-[150px]">Estado</TableHead>
                  <TableHead className="text-right w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-club-brown/70" />
                        <span className="mt-2 text-sm text-club-brown/70">Cargando dominios...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDomains.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <p className="text-club-brown/70">
                        {searchQuery.length > 0 
                          ? "No se encontraron dominios que coincidan con la búsqueda."
                          : "No hay dominios registrados."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDomains.map((domain) => (
                    <TableRow key={domain.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium flex items-center gap-2">
                        <Globe size={16} className="text-club-brown/70" />
                        {domain.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{domain.path}</TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                          {domain.status === "available" ? "Disponible" : 
                           domain.status === "reserved" ? "Reservado" : "En Uso"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditDomain(domain)}
                          >
                            <Edit size={16} />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteDomain(domain)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, i, array) => (
                    <>
                      {i > 0 && array[i-1] !== page - 1 && (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      )}
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className={page === currentPage ? "bg-club-orange text-white border-club-orange" : ""}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  ))
                }
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `Editar Dominio: ${currentDomain?.name}` : "Nuevo Dominio"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del dominio"
                autoComplete="off"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="path">Ruta</Label>
              <Input
                id="path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/ruta-del-dominio"
                autoComplete="off"
              />
              <p className="text-xs text-club-brown/70">Ejemplo: /mi-proyecto</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción del dominio"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={status} onValueChange={(val: "available" | "reserved" | "used") => setStatus(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="used">En Uso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="externalUrl" className="flex items-center gap-2">
                URL Externa <ExternalLink size={14} />
              </Label>
              <Input
                id="externalUrl"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://ejemplo.com (opcional)"
                autoComplete="off"
              />
              <p className="text-xs text-club-brown/70">
                Opcional. Si se proporciona, el dominio redireccionará a esta URL.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !name || !path}
              className="bg-club-orange hover:bg-club-orange/90 text-white"
            >
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DomainManagement;
