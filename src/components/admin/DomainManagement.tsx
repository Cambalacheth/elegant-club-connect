
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDomains, Domain } from '@/hooks/useDomains';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const DomainManagement = () => {
  const { domains, loading: loadingDomains } = useDomains();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [deletingDomain, setDeletingDomain] = useState<Domain | null>(null);
  const { toast } = useToast();
  
  // New domain form state
  const [newDomain, setNewDomain] = useState<Omit<Domain, 'id'>>({
    name: '',
    path: '',
    description: '',
    status: 'available',
    owner: '',
    externalUrl: '',
  });
  
  // Handle form input changes for new domain
  const handleNewDomainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDomain(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes for new domain
  const handleStatusChange = (value: string) => {
    setNewDomain(prev => ({ 
      ...prev, 
      status: value as 'available' | 'reserved' | 'used' 
    }));
  };
  
  // Handle form input changes for editing domain
  const handleEditDomainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingDomain) {
      setEditingDomain({ ...editingDomain, [name]: value });
    }
  };
  
  // Handle select changes for editing domain
  const handleEditStatusChange = (value: string) => {
    if (editingDomain) {
      setEditingDomain({ 
        ...editingDomain, 
        status: value as 'available' | 'reserved' | 'used' 
      });
    }
  };
  
  // Handle creating a new domain
  const handleAddDomain = async () => {
    try {
      // Ensure path starts with /
      const formattedPath = newDomain.path.startsWith('/') 
        ? newDomain.path 
        : `/${newDomain.path}`;
      
      const domainToCreate = {
        name: newDomain.name,
        path: formattedPath,
        description: newDomain.description,
        status: newDomain.status,
        owner: newDomain.owner || null,
        external_url: newDomain.externalUrl || null
      };
      
      const { error } = await supabase
        .from('domains')
        .insert([domainToCreate]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Dominio creado",
        description: `El dominio ${newDomain.name} ha sido creado correctamente.`
      });
      
      // Reset form and close dialog
      setNewDomain({
        name: '',
        path: '',
        description: '',
        status: 'available',
        owner: '',
        externalUrl: ''
      });
      setIsAddDialogOpen(false);
      
      // Reload the page to refresh the domains list
      window.location.reload();
      
    } catch (error) {
      console.error("Error creating domain:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el dominio.",
        variant: "destructive"
      });
    }
  };
  
  // Handle updating a domain
  const handleUpdateDomain = async () => {
    if (!editingDomain) return;
    
    try {
      // Ensure path starts with /
      const formattedPath = editingDomain.path.startsWith('/') 
        ? editingDomain.path 
        : `/${editingDomain.path}`;
      
      const domainToUpdate = {
        name: editingDomain.name,
        path: formattedPath,
        description: editingDomain.description,
        status: editingDomain.status,
        owner: editingDomain.owner || null,
        external_url: editingDomain.externalUrl || null
      };
      
      const { error } = await supabase
        .from('domains')
        .update(domainToUpdate)
        .eq('id', editingDomain.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Dominio actualizado",
        description: `El dominio ${editingDomain.name} ha sido actualizado correctamente.`
      });
      
      // Reset and close dialog
      setEditingDomain(null);
      setIsEditDialogOpen(false);
      
      // Reload the page to refresh the domains list
      window.location.reload();
      
    } catch (error) {
      console.error("Error updating domain:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar el dominio.",
        variant: "destructive"
      });
    }
  };
  
  // Handle deleting a domain
  const handleDeleteDomain = async () => {
    if (!deletingDomain) return;
    
    try {
      const { error } = await supabase
        .from('domains')
        .delete()
        .eq('id', deletingDomain.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Dominio eliminado",
        description: `El dominio ${deletingDomain.name} ha sido eliminado correctamente.`
      });
      
      // Reset and close dialog
      setDeletingDomain(null);
      setIsDeleteDialogOpen(false);
      
      // Reload the page to refresh the domains list
      window.location.reload();
      
    } catch (error) {
      console.error("Error deleting domain:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el dominio.",
        variant: "destructive"
      });
    }
  };
  
  // Get status badge color based on status
  const getStatusBadgeColor = (status: string) => {
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
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Dominios</CardTitle>
          <CardDescription>
            Administra los dominios disponibles en Terreta Hub
          </CardDescription>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-club-orange hover:bg-club-terracotta text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Dominio
        </Button>
      </CardHeader>
      <CardContent>
        {loadingDomains ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-club-brown mx-auto"></div>
            <p className="mt-2 text-club-brown/70">Cargando dominios...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>URL Externa</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>{domain.path}</TableCell>
                    <TableCell>
                      {domain.description.length > 30 
                        ? `${domain.description.substring(0, 30)}...` 
                        : domain.description}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(domain.status)}`}>
                        {domain.status === 'available' ? 'Disponible' : 
                         domain.status === 'reserved' ? 'Reservado' : 'En Uso'}
                      </span>
                    </TableCell>
                    <TableCell>{domain.owner || '-'}</TableCell>
                    <TableCell>{domain.externalUrl ? (
                      <a 
                        href={domain.externalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-club-orange hover:underline"
                      >
                        Ver enlace
                      </a>
                    ) : '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingDomain(domain);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setDeletingDomain(domain);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      {/* Add Domain Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir nuevo dominio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nombre</label>
              <Input 
                id="name" 
                name="name" 
                value={newDomain.name} 
                onChange={handleNewDomainChange}
                placeholder="Ej. Proyectos"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="path" className="text-sm font-medium">Ruta</label>
              <Input 
                id="path" 
                name="path" 
                value={newDomain.path} 
                onChange={handleNewDomainChange}
                placeholder="Ej. /projects"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Descripción</label>
              <Textarea 
                id="description" 
                name="description" 
                value={newDomain.description} 
                onChange={handleNewDomainChange}
                placeholder="Descripción del dominio"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Estado</label>
              <Select 
                onValueChange={handleStatusChange} 
                defaultValue={newDomain.status}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="used">En Uso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="owner" className="text-sm font-medium">Propietario (opcional)</label>
              <Input 
                id="owner" 
                name="owner" 
                value={newDomain.owner || ''} 
                onChange={handleNewDomainChange}
                placeholder="Nombre del propietario"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="externalUrl" className="text-sm font-medium">URL Externa (opcional)</label>
              <Input 
                id="externalUrl" 
                name="externalUrl" 
                value={newDomain.externalUrl || ''} 
                onChange={handleNewDomainChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleAddDomain}
              className="bg-club-orange hover:bg-club-terracotta text-white"
              disabled={!newDomain.name || !newDomain.path}
            >
              Añadir Dominio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Domain Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar dominio</DialogTitle>
          </DialogHeader>
          {editingDomain && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Nombre</label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={editingDomain.name} 
                  onChange={handleEditDomainChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-path" className="text-sm font-medium">Ruta</label>
                <Input 
                  id="edit-path" 
                  name="path" 
                  value={editingDomain.path} 
                  onChange={handleEditDomainChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">Descripción</label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={editingDomain.description} 
                  onChange={handleEditDomainChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-status" className="text-sm font-medium">Estado</label>
                <Select 
                  onValueChange={handleEditStatusChange} 
                  defaultValue={editingDomain.status}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                    <SelectItem value="used">En Uso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-owner" className="text-sm font-medium">Propietario (opcional)</label>
                <Input 
                  id="edit-owner" 
                  name="owner" 
                  value={editingDomain.owner || ''} 
                  onChange={handleEditDomainChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-externalUrl" className="text-sm font-medium">URL Externa (opcional)</label>
                <Input 
                  id="edit-externalUrl" 
                  name="externalUrl" 
                  value={editingDomain.externalUrl || ''} 
                  onChange={handleEditDomainChange}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleUpdateDomain}
              className="bg-club-orange hover:bg-club-terracotta text-white"
              disabled={!editingDomain?.name || !editingDomain?.path}
            >
              Actualizar Dominio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Domain Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          {deletingDomain && (
            <div className="py-4">
              <p className="mb-4">¿Estás seguro de que quieres eliminar el dominio <strong>{deletingDomain.name}</strong>?</p>
              <p className="text-red-500 text-sm">Esta acción no se puede deshacer.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteDomain}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DomainManagement;
