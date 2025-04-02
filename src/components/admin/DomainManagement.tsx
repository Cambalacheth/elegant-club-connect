
import { useState, useEffect } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookPlus, Pencil, Globe, ExternalLink } from "lucide-react";

interface Domain {
  id: string;
  name: string;
  path: string;
  description: string | null;
  status: "available" | "reserved" | "used";
  owner: string | null;
  external_url: string | null;
}

const DomainManagement = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<Domain | null>(null);
  const [isNewDomain, setIsNewDomain] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    path: "",
    description: "",
    status: "available" as "available" | "reserved" | "used",
    owner: "",
    external_url: ""
  });

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .order('name');

      if (error) throw error;
      setDomains(data || []);
    } catch (error) {
      console.error("Error fetching domains:", error);
      toast.error("Failed to load domains");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as "available" | "reserved" | "used" }));
  };

  const handleCreateDomain = () => {
    setIsNewDomain(true);
    setCurrentDomain(null);
    setFormData({
      name: "",
      path: "",
      description: "",
      status: "available",
      owner: "",
      external_url: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditDomain = (domain: Domain) => {
    setIsNewDomain(false);
    setCurrentDomain(domain);
    setFormData({
      name: domain.name,
      path: domain.path,
      description: domain.description || "",
      status: domain.status,
      owner: domain.owner || "",
      external_url: domain.external_url || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure path starts with "/"
      const path = formData.path.startsWith('/') ? formData.path : `/${formData.path}`;
      
      // Prepare data for Supabase
      const domainData = {
        name: formData.name,
        path,
        description: formData.description || null,
        status: formData.status,
        owner: formData.owner || null,
        external_url: formData.external_url || null,
      };

      if (isNewDomain) {
        // Create new domain
        const { error } = await supabase.from('domains').insert([domainData]);
        if (error) throw error;
        toast.success("Dominio creado con éxito");
      } else {
        // Update existing domain
        const { error } = await supabase
          .from('domains')
          .update(domainData)
          .eq('id', currentDomain?.id);
        
        if (error) throw error;
        toast.success("Dominio actualizado con éxito");
      }

      // Refresh domains list and close dialog
      fetchDomains();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving domain:", error);
      toast.error("Error al guardar el dominio");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available': 
        return 'bg-green-100 text-green-800';
      case 'reserved': 
        return 'bg-amber-100 text-amber-800';
      case 'used': 
        return 'bg-blue-100 text-blue-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'reserved': return 'Reservado';
      case 'used': return 'En Uso';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-club-brown">
          Administración de Dominios
        </h2>
        <Button 
          onClick={handleCreateDomain}
          className="bg-club-orange text-white hover:bg-club-terracotta flex items-center gap-2"
        >
          <BookPlus size={18} />
          Nuevo Dominio
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-club-brown"></div>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.name}</TableCell>
                  <TableCell>{domain.path}</TableCell>
                  <TableCell className="max-w-xs truncate">{domain.description}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(domain.status)}`}>
                      {getStatusLabel(domain.status)}
                    </span>
                  </TableCell>
                  <TableCell>{domain.owner || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEditDomain(domain)}
                    >
                      <Pencil size={16} />
                    </Button>
                    {domain.external_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(domain.external_url!, '_blank')}
                      >
                        <ExternalLink size={16} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Domain Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe size={18} /> 
              {isNewDomain ? "Crear nuevo dominio" : "Editar dominio"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Nombre del dominio</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="ej. Legal"
                />
              </div>
              
              <div>
                <Label htmlFor="path">Ruta (comienza con /)</Label>
                <Input 
                  id="path" 
                  name="path" 
                  value={formData.path} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="ej. /legal"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe el propósito de este dominio"
                  className="resize-none"
                />
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                >
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
              
              <div>
                <Label htmlFor="owner">Propietario (opcional)</Label>
                <Input 
                  id="owner" 
                  name="owner" 
                  value={formData.owner} 
                  onChange={handleInputChange} 
                  placeholder="ej. Departamento Legal"
                />
              </div>
              
              <div>
                <Label htmlFor="external_url">URL externa (opcional)</Label>
                <Input 
                  id="external_url" 
                  name="external_url" 
                  type="url"
                  value={formData.external_url} 
                  onChange={handleInputChange} 
                  placeholder="ej. https://ejemplo.com"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-club-orange text-white hover:bg-club-terracotta">
                {isNewDomain ? "Crear Dominio" : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DomainManagement;
