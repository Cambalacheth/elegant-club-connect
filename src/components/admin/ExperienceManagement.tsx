
import { useState, useEffect } from "react";
import { Search, PlusCircle, MinusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import UserTable from "./UserTable";
import EmptyUserState from "./EmptyUserState";
import useAdminUsers from "@/hooks/useAdminUsers";
import { Profile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { UserLevel, LEVEL_THRESHOLDS, LEVEL_NAMES, getLevelInfo } from "@/types/user";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ExperienceManagement = () => {
  const { toast } = useToast();
  const { users, isLoading, refetch, searchTerm, setSearchTerm } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [xpAmount, setXpAmount] = useState<number>(50);
  const [xpDescription, setXpDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New state for level management dialog
  const [levelDialogOpen, setLevelDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>(1);

  const handleModifyExperience = async () => {
    if (!selectedUser || !xpDescription.trim() || xpAmount === 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Insert directly into user_xp_history
      const { error } = await supabase
        .from("user_xp_history")
        .insert({
          user_id: selectedUser.id,
          xp_amount: xpAmount,
          description: `Admin: ${xpDescription}`,
        });

      if (error) throw error;

      toast({
        title: "XP actualizada",
        description: `Se han ${xpAmount > 0 ? "añadido" : "removido"} ${Math.abs(xpAmount)} puntos de experiencia a ${selectedUser.username}`,
      });

      setSelectedUser(null);
      setXpAmount(50);
      setXpDescription("");
      refetch();
    } catch (error: any) {
      console.error("Error modifying XP:", error);
      toast({
        title: "Error",
        description: "No se pudo modificar la experiencia del usuario",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // New function to handle level change
  const handleLevelChange = async () => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);

      // Calculate minimum XP required for this level
      const minXpForLevel = LEVEL_THRESHOLDS[selectedLevel - 1] || 0;
      
      // First update the level in the profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          level_numeric: selectedLevel,
          experience: Math.max(minXpForLevel, selectedUser.experience || 0)
        })
        .eq("id", selectedUser.id);

      if (updateError) throw updateError;

      // Add XP history entry for admin level change
      const xpDifference = minXpForLevel - (selectedUser.experience || 0);
      
      if (xpDifference > 0) {
        const { error: xpError } = await supabase
          .from("user_xp_history")
          .insert({
            user_id: selectedUser.id,
            xp_amount: xpDifference,
            description: `Admin: Ajuste de nivel a ${selectedLevel}`
          });
        
        if (xpError) throw xpError;
      }

      toast({
        title: "Nivel actualizado",
        description: `${selectedUser.username} ahora es nivel ${selectedLevel} (${LEVEL_NAMES[selectedLevel]})`,
      });

      setLevelDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Error updating level:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el nivel del usuario",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserClick = (user: Profile) => {
    setSelectedUser(user);
  };

  const openLevelDialog = (user: Profile) => {
    setSelectedUser(user);
    setSelectedLevel(user.level || 1);
    setLevelDialogOpen(true);
  };

  const levelData = LEVEL_THRESHOLDS.map((threshold, index) => {
    const level = index + 1;
    const levelName = LEVEL_NAMES[level as keyof typeof LEVEL_NAMES] || "Desconocido";
    
    // Get unlocks based on level
    let unlocks = [];
    
    if (level >= 2) unlocks.push("Crear comentarios y votar");
    if (level >= 4) unlocks.push("Crear debates en el foro");
    if (level >= 8) unlocks.push("Moderar contenido");
    if (level >= 10) unlocks.push("Gestionar contenido");
    if (level === 13) unlocks.push("Acceso a panel de administración");
    
    const nextLevel = LEVEL_THRESHOLDS[index + 1];
    const xpRequired = nextLevel ? nextLevel - threshold : "Máximo";
    
    return {
      level,
      name: levelName,
      minXp: threshold,
      xpToNext: xpRequired,
      unlocks: unlocks.join(", ")
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Gestión de Experiencia</h2>
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
        ) : users && users.length > 0 ? (
          <div>
            <div className="mb-4 space-y-2">
              <h3 className="text-lg font-medium">Acciones rápidas</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="border-club-beige text-club-brown"
                  onClick={() => selectedUser && openLevelDialog(selectedUser)}
                  disabled={!selectedUser}
                >
                  Cambiar nivel directamente
                </Button>
                <Button 
                  variant="outline" 
                  className="border-club-beige text-club-brown"
                  onClick={() => {
                    if (selectedUser) {
                      setXpAmount(100);
                      setXpDescription("Bonificación manual");
                    }
                  }}
                  disabled={!selectedUser}
                >
                  +100 XP
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600"
                  onClick={() => {
                    if (selectedUser) {
                      setXpAmount(-50);
                      setXpDescription("Penalización manual");
                    }
                  }}
                  disabled={!selectedUser}
                >
                  -50 XP
                </Button>
              </div>
            </div>
            
            <UserTable 
              users={users} 
              onEditUser={handleUserClick} 
              selectedUserId={selectedUser?.id || null}
            />
          </div>
        ) : (
          <EmptyUserState searchTerm={searchTerm} />
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Niveles y Desbloqueos</h2>
        <Table>
          <TableCaption>Sistema de niveles de Terreta Hub</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nivel</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>XP Mínima</TableHead>
              <TableHead>XP para siguiente nivel</TableHead>
              <TableHead className="w-1/3">Desbloqueos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levelData.map((item) => (
              <TableRow key={item.level}>
                <TableCell className="font-medium">{item.level}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.minXp}</TableCell>
                <TableCell>{typeof item.xpToNext === "string" ? item.xpToNext : item.xpToNext}</TableCell>
                <TableCell>{item.unlocks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for modifying user experience */}
      <Dialog open={!!selectedUser && !levelDialogOpen} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-2 border-club-beige shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-club-brown">Modificar Experiencia</DialogTitle>
            <DialogDescription>
              {selectedUser ? (
                <>
                  Añade o remueve XP para <span className="font-semibold">{selectedUser.username}</span>.
                  <br />
                  Experiencia actual: <span className="font-semibold">{selectedUser.experience} XP</span>
                  <br />
                  Nivel actual: <span className="font-semibold">
                    {selectedUser.level} ({getLevelInfo(selectedUser.experience || 0).level})
                  </span>
                </>
              ) : (
                "Cargando datos del usuario..."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => setXpAmount((prev) => prev > 0 ? prev * -1 : prev)}
                className={xpAmount > 0 ? "bg-green-50" : "bg-red-50"}
              >
                {xpAmount > 0 ? <PlusCircle className="h-4 w-4 text-green-600" /> : <MinusCircle className="h-4 w-4 text-red-600" />}
              </Button>
              <Input
                type="number"
                value={Math.abs(xpAmount)}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setXpAmount(xpAmount > 0 ? value : -value);
                }}
                className="w-full"
                placeholder="Cantidad de XP"
              />
            </div>
            <div>
              <label htmlFor="xp-description" className="text-sm text-gray-500 mb-1 block">
                Descripción (obligatorio)
              </label>
              <Input
                id="xp-description"
                value={xpDescription}
                onChange={(e) => setXpDescription(e.target.value)}
                placeholder="Ej: Participación en evento"
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedUser(null)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleModifyExperience}
              disabled={isSubmitting || !xpDescription.trim() || xpAmount === 0}
              className={xpAmount > 0 ? "bg-club-orange hover:bg-club-terracotta text-white" : "bg-red-500 hover:bg-red-600 text-white"}
            >
              {isSubmitting ? "Procesando..." : xpAmount > 0 ? "Añadir XP" : "Quitar XP"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New dialog for directly changing user level */}
      <Dialog open={levelDialogOpen} onOpenChange={setLevelDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-2 border-club-beige shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-club-brown">Cambiar Nivel</DialogTitle>
            <DialogDescription>
              {selectedUser ? (
                <>
                  Asignar nuevo nivel para <span className="font-semibold">{selectedUser.username}</span>.
                  <br />
                  Nivel actual: <span className="font-semibold">{selectedUser.level}</span>
                  <br />
                  Experiencia actual: <span className="font-semibold">{selectedUser.experience} XP</span>
                </>
              ) : (
                "Cargando datos del usuario..."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="level-select" className="text-sm font-medium text-gray-600">
                Selecciona un nivel (1-13)
              </label>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(13)].map((_, i) => {
                  const level = i + 1;
                  return (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      className={selectedLevel === level 
                        ? "bg-club-orange text-white hover:bg-club-terracotta" 
                        : "border-club-beige text-club-brown hover:bg-club-beige/20"}
                      onClick={() => setSelectedLevel(level as UserLevel)}
                    >
                      {level}
                    </Button>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="text-sm font-medium">{LEVEL_NAMES[selectedLevel as keyof typeof LEVEL_NAMES]}</div>
                <div className="text-xs text-gray-500 mt-1">
                  XP mínima requerida: {LEVEL_THRESHOLDS[selectedLevel - 1]}
                </div>
              </div>
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                <strong>Nota:</strong> Si el usuario tiene menos XP de la requerida para este nivel, 
                se añadirán los puntos necesarios automáticamente.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setLevelDialogOpen(false)}
              className="border-club-beige text-club-brown"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleLevelChange}
              disabled={isSubmitting || !selectedUser || selectedLevel === selectedUser.level}
              className="bg-club-orange hover:bg-club-terracotta text-white"
            >
              {isSubmitting ? "Guardando..." : "Cambiar nivel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperienceManagement;
