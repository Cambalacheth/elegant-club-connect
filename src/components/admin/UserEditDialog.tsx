
import { useState } from "react";
import { Profile } from "@/types/profile";
import { Check, X } from "lucide-react";
import { UserLevel, getLevelName } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserEditDialogProps {
  user: Profile | null;
  onClose: () => void;
  onSave: () => void;
}

const UserEditDialog = ({ user, onClose, onSave }: UserEditDialogProps) => {
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState<number>(user?.level || 1);
  const [experiencePoints, setExperiencePoints] = useState<number>(user?.experience || 0);

  const handleSaveUser = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          level_numeric: selectedLevel,
          experience: experiencePoints
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Usuario actualizado",
        description: `El nivel de ${user.username} ha sido actualizado a ${selectedLevel}`,
      });

      onSave();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Actualiza el nivel y experiencia de {user?.username}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar_url || undefined} />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{user?.username}</h4>
              <p className="text-sm text-gray-500">
                {user?.description || "Sin descripción"}
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
                {[...Array(13)].map((_, i) => {
                  const level = (i + 1) as UserLevel;
                  return (
                    <SelectItem key={level} value={level.toString()}>
                      Nivel {level} - {getLevelName(level)}
                    </SelectItem>
                  );
                })}
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
          <Button variant="outline" onClick={onClose}>
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
  );
};

export default UserEditDialog;
