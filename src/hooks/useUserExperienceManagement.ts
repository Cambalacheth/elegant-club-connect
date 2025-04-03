
import { useState } from "react";
import { Profile } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserLevel, LEVEL_THRESHOLDS } from "@/types/user";

export const useUserExperienceManagement = (onUpdate: () => void) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update user level
  const updateUserLevel = async (userId: string, newLevel: UserLevel) => {
    if (!userId) return;

    try {
      setIsSubmitting(true);

      // Calculate minimum XP required for this level
      const minXpForLevel = LEVEL_THRESHOLDS[newLevel - 1] || 0;
      
      // Get current user XP
      const { data: userData } = await supabase
        .from("profiles")
        .select("experience")
        .eq("id", userId)
        .single();
      
      const currentXp = userData?.experience || 0;
      
      // Update the level in the profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          level_numeric: newLevel,
          experience: Math.max(minXpForLevel, currentXp)
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Add XP history entry if needed
      const xpDifference = minXpForLevel - currentXp;
      
      if (xpDifference > 0) {
        const { error: xpError } = await supabase
          .from("user_xp_history")
          .insert({
            user_id: userId,
            xp_amount: xpDifference,
            description: `Admin: Ajuste de nivel a ${newLevel}`
          });
        
        if (xpError) throw xpError;
      }

      toast({
        title: "Nivel actualizado",
        description: `El nivel del usuario se ha actualizado correctamente`,
      });
      
      // Refresh data
      onUpdate();
      
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

  // Modify user XP
  const modifyUserXp = async (userId: string, amount: number, description: string) => {
    if (!userId || !description.trim() || amount === 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Insert into user_xp_history
      const { error } = await supabase
        .from("user_xp_history")
        .insert({
          user_id: userId,
          xp_amount: amount,
          description: `Admin: ${description}`,
        });

      if (error) throw error;

      toast({
        title: "XP actualizada",
        description: `Se han ${amount > 0 ? "añadido" : "removido"} ${Math.abs(amount)} puntos de experiencia`,
      });

      // Refresh data
      onUpdate();
      
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

  const handleQuickXpAction = (user: Profile, amount: number, description: string) => {
    if (user) {
      modifyUserXp(user.id, amount, description);
    }
  };

  return {
    isSubmitting,
    updateUserLevel,
    modifyUserXp,
    handleQuickXpAction
  };
};

export default useUserExperienceManagement;
