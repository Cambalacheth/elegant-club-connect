
import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";
import { Check, X } from "lucide-react";
import { UserLevel, getLevelName, LEVEL_THRESHOLDS } from "@/types/user";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state when user changes
  useEffect(() => {
    if (user) {
      setSelectedLevel(user.level || 1);
      setExperiencePoints(user.experience || 0);
    }
  }, [user]);

  const handleSaveUser = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      // Calculate minimum XP required for selected level
      const minXpForLevel = LEVEL_THRESHOLDS[selectedLevel - 1] || 0;
      const finalXp = Math.max(experiencePoints, minXpForLevel);
      
      // Update the user's level and XP
      const { error } = await supabase
        .from("profiles")
        .update({ 
          level_numeric: selectedLevel,
          experience: finalXp
        })
        .eq("id", user.id);

      if (error) throw error;

      // If we had to adjust XP to meet minimum level requirements, add an XP history entry
      if (finalXp > experiencePoints) {
        const xpDifference = finalXp - experiencePoints;
        
        await supabase
          .from("user_xp_history")
          .insert({
            user_id: user.id,
            xp_amount: xpDifference,
            description: `Admin: Ajuste automático para nivel ${selectedLevel}`
          });
      }

      toast({
        title: "Usuario actualizado",
        description: `${user.username} ahora es nivel ${selectedLevel} con ${finalXp} XP`,
      });

      onSave();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            <p className="text-xs text-amber-600 mt-1 bg-amber-50 p-2 rounded">
              <strong>Nota:</strong> Si el XP actual es menor que el mínimo requerido para este nivel, 
              se ajustará automáticamente.
            </p>
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
            disabled={isSubmitting}
            className="bg-club-orange hover:bg-club-terracotta text-white"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
