
import { useState } from "react";
import { Profile } from "@/types/profile";
import { UserLevel } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export const useExperienceManagementDialogs = (onUpdate: () => void) => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [levelDialogOpen, setLevelDialogOpen] = useState(false);
  const [xpDialogOpen, setXpDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle user selection
  const handleSelectUser = (user: Profile) => {
    setSelectedUser(user);
  };

  // Open level management dialog
  const openLevelDialog = (user: Profile) => {
    setSelectedUser(user);
    setLevelDialogOpen(true);
  };

  // Open XP modification dialog
  const openXpDialog = (user: Profile) => {
    setSelectedUser(user);
    setXpDialogOpen(true);
  };

  // Reset all dialogs and selection
  const resetDialogs = () => {
    setSelectedUser(null);
    setLevelDialogOpen(false);
    setXpDialogOpen(false);
  };

  // Handle dialog success
  const handleDialogSuccess = () => {
    resetDialogs();
    if (onUpdate) {
      onUpdate();
    }
    
    toast({
      title: "Operación completada",
      description: "Los cambios se han aplicado correctamente",
    });
  };

  return {
    selectedUser,
    levelDialogOpen,
    xpDialogOpen,
    isSubmitting,
    setIsSubmitting,
    handleSelectUser,
    openLevelDialog,
    openXpDialog,
    setLevelDialogOpen,
    setXpDialogOpen,
    resetDialogs,
    handleDialogSuccess
  };
};

export default useExperienceManagementDialogs;
