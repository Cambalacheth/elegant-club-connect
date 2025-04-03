
import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";
import { UserLevel, LEVEL_NAMES, LEVEL_THRESHOLDS } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LevelManagementDialogProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const LevelManagementDialog = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}: LevelManagementDialogProps) => {
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>(user?.level as UserLevel || 1 as UserLevel);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset selected level when user changes
  useEffect(() => {
    if (user) {
      setSelectedLevel((user.level as UserLevel) || 1 as UserLevel);
    }
  }, [user]);

  const handleLevelChange = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      // Calculate minimum XP required for this level
      const minXpForLevel = LEVEL_THRESHOLDS[selectedLevel - 1] || 0;
      
      // First update the level in the profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          level_numeric: selectedLevel,
          experience: Math.max(minXpForLevel, user.experience || 0)
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Add XP history entry for admin level change
      const xpDifference = minXpForLevel - (user.experience || 0);
      
      if (xpDifference > 0) {
        const { error: xpError } = await supabase
          .from("user_xp_history")
          .insert({
            user_id: user.id,
            xp_amount: xpDifference,
            description: `Admin: Ajuste de nivel a ${selectedLevel}`
          });
        
        if (xpError) throw xpError;
      }

      toast({
        title: "Nivel actualizado",
        description: `${user.username} ahora es nivel ${selectedLevel} (${LEVEL_NAMES[selectedLevel]})`,
      });

      onSuccess();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-2 border-club-beige shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-club-brown">Cambiar Nivel</DialogTitle>
          <DialogDescription>
            {user ? (
              <>
                Asignar nuevo nivel para <span className="font-semibold">{user.username}</span>.
                <br />
                Nivel actual: <span className="font-semibold">{user.level}</span>
                <br />
                Experiencia actual: <span className="font-semibold">{user.experience} XP</span>
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
                const level = (i + 1) as UserLevel;
                return (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    className={selectedLevel === level 
                      ? "bg-club-orange text-white hover:bg-club-terracotta" 
                      : "border-club-beige text-club-brown hover:bg-club-beige/20"}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </Button>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="text-sm font-medium">{LEVEL_NAMES[selectedLevel]}</div>
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
            onClick={() => onOpenChange(false)}
            className="border-club-beige text-club-brown"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleLevelChange}
            disabled={isSubmitting || !user || selectedLevel === user.level}
            className="bg-club-orange hover:bg-club-terracotta text-white"
          >
            {isSubmitting ? "Guardando..." : "Cambiar nivel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LevelManagementDialog;
