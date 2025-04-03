
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
      <DialogContent className="bg-white/95 backdrop-blur-md border-2 border-club-beige shadow-xl max-w-md mx-auto">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-serif text-club-brown">Editar Usuario</DialogTitle>
          <DialogDescription>
            Actualiza el nivel y experiencia de <span className="font-medium">{user?.username}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4 bg-club-beige/20 p-3 rounded-md">
            <Avatar className="h-14 w-14 border-2 border-club-orange/20">
              <AvatarImage src={user?.avatar_url || undefined} />
              <AvatarFallback className="bg-club-orange/80 text-white">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-club-brown text-lg">{user?.username}</h4>
              <p className="text-sm text-club-brown/70">
                {user?.description || "Sin descripción"}
              </p>
            </div>
          </div>

          <div className="space-y-2 bg-white p-4 rounded-md border border-gray-100">
            <label htmlFor="user-level" className="text-sm font-medium text-club-brown">
              Nivel de Usuario (1-13)
            </label>
            <Select value={selectedLevel.toString()} onValueChange={(val) => setSelectedLevel(Number(val))}>
              <SelectTrigger id="user-level" className="bg-white border-club-beige">
                <SelectValue placeholder="Selecciona un nivel" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-club-beige">
                {[...Array(13)].map((_, i) => {
                  const level = (i + 1) as UserLevel;
                  return (
                    <SelectItem key={level} value={level.toString()} className="focus:bg-club-beige/20 focus:text-club-brown">
                      Nivel {level} - {getLevelName(level)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 bg-white p-4 rounded-md border border-gray-100">
            <label htmlFor="user-xp" className="text-sm font-medium text-club-brown">
              Puntos de Experiencia
            </label>
            <Input
              id="user-xp"
              type="number"
              min="0"
              value={experiencePoints}
              onChange={(e) => setExperiencePoints(Number(e.target.value))}
              className="w-full bg-white border-club-beige"
            />
            <p className="text-xs text-club-brown/70 bg-club-beige/10 p-2 rounded">
              Level 2: 100 XP | Level 5: 1000 XP | Level 8: 3000 XP | Level 12: 10000 XP
            </p>
          </div>
        </div>

        <DialogFooter className="border-t pt-3 space-x-2">
          <Button variant="outline" onClick={onClose} className="border-club-beige text-club-brown">
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
