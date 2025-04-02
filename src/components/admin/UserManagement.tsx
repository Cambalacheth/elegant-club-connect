import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { AlertCircle, User, Edit, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

const levelOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Terretiano", label: "Terretiano" },
  { value: "Terretiana", label: "Terretiana" },
  { value: "Moderador", label: "Moderador" },
];

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [experiencePoints, setExperiencePoints] = useState<number>(0);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        });
        throw error;
      }

      return data as Profile[];
    },
  });

  const filteredUsers = users?.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: Profile) => {
    setEditingUser(user);
    const numericLevel = user.level ? (
      typeof user.level === 'string' 
        ? parseInt(user.level, 10)
        : Number(user.level)
    ) : 1;
    
    setSelectedLevel(numericLevel || 1);
    setExperiencePoints(user.experience || 0);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          level: selectedLevel,
          experience: experiencePoints
        })
        .eq("id", editingUser.id);

      if (error) throw error;

      toast({
        title: "Usuario actualizado",
        description: `El nivel de ${editingUser.username} ha sido actualizado a ${selectedLevel}`,
      });

      setEditingUser(null);
      refetch();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar usuarios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-orange"></div>
        </div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email Visible</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {user.description || "Sin descripción"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.email_visible ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="mr-1 h-3 w-3" /> Visible
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                        <X className="mr-1 h-3 w-3" /> No visible
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.level === "Admin"
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : user.level === "Moderador"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {user.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No se encontraron usuarios</h3>
          <p className="text-gray-500">
            {searchTerm
              ? "No hay usuarios que coincidan con tu búsqueda."
              : "No hay usuarios registrados en el sistema."}
          </p>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualiza el nivel y experiencia de {editingUser?.username}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={editingUser?.avatar_url || undefined} />
                <AvatarFallback>
                  {editingUser?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{editingUser?.username}</h4>
                <p className="text-sm text-gray-500">
                  {editingUser?.description || "Sin descripción"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="user-level" className="text-sm font-medium">
                Nivel de Usuario (1-13)
              </label>
              <Select value={selectedLevel.toString()} onValueChange={(val) => setSelectedLevel(Number(val))}>
                <SelectTrigger id="user-level">
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(13)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Nivel {i + 1} - {getLevelName(i + 1 as UserLevel)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="user-xp" className="text-sm font-medium">
                Puntos de Experiencia
              </label>
              <Input
                id="user-xp"
                type="number"
                min="0"
                value={experiencePoints}
                onChange={(e) => setExperiencePoints(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Level 2: 100 XP | Level 5: 1000 XP | Level 8: 3000 XP | Level 12: 10000 XP
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveUser} 
              className="bg-club-orange hover:bg-club-terracotta text-white"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
