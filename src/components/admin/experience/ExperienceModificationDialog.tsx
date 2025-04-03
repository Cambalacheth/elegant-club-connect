
import { useState } from "react";
import { Profile } from "@/types/profile";
import { PlusCircle, MinusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getLevelInfo } from "@/types/user";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExperienceModificationDialogProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ExperienceModificationDialog = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}: ExperienceModificationDialogProps) => {
  const { toast } = useToast();
  const [xpAmount, setXpAmount] = useState<number>(50);
  const [xpDescription, setXpDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModifyExperience = async () => {
    if (!user || !xpDescription.trim() || xpAmount === 0) {
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
          user_id: user.id,
          xp_amount: xpAmount,
          description: `Admin: ${xpDescription}`,
        });

      if (error) throw error;

      toast({
        title: "XP actualizada",
        description: `Se han ${xpAmount > 0 ? "añadido" : "removido"} ${Math.abs(xpAmount)} puntos de experiencia a ${user.username}`,
      });

      setXpAmount(50);
      setXpDescription("");
      onSuccess();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md border-2 border-club-beige shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-club-brown">Modificar Experiencia</DialogTitle>
          <DialogDescription>
            {user ? (
              <>
                Añade o remueve XP para <span className="font-semibold">{user.username}</span>.
                <br />
                Experiencia actual: <span className="font-semibold">{user.experience} XP</span>
                <br />
                Nivel actual: <span className="font-semibold">
                  {user.level} ({getLevelInfo(user.experience || 0).level})
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
            onClick={() => onOpenChange(false)}
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
  );
};

export default ExperienceModificationDialog;
