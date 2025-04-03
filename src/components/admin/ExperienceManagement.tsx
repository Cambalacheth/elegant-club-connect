
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserTable from "./UserTable";
import EmptyUserState from "./EmptyUserState";
import useAdminUsers from "@/hooks/useAdminUsers";
import QuickActions from "./experience/QuickActions";
import LevelsTable from "./experience/LevelsTable";
import LevelManagementDialog from "./experience/LevelManagementDialog";
import ExperienceModificationDialog from "./experience/ExperienceModificationDialog";
import useUserExperienceManagement from "@/hooks/useUserExperienceManagement";

const ExperienceManagement = () => {
  const { users, isLoading, refetch, searchTerm, setSearchTerm } = useAdminUsers();
  const {
    selectedUser,
    levelDialogOpen,
    xpDialogOpen,
    isSubmitting,
    handleSelectUser,
    openLevelDialog,
    openXpDialog,
    setLevelDialogOpen,
    setXpDialogOpen,
    updateUserLevel,
    modifyUserXp,
    handleQuickXpAction
  } = useUserExperienceManagement(refetch);

  return (
    <div className="space-y-6">
      {/* User management section */}
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
            <QuickActions 
              selectedUser={selectedUser} 
              onLevelChange={openLevelDialog}
              onAddXP={(user, amount, description) => handleQuickXpAction(user, amount, description)}
            />
            
            <UserTable 
              users={users} 
              onEditUser={handleSelectUser} 
              selectedUserId={selectedUser?.id || null}
            />
          </div>
        ) : (
          <EmptyUserState searchTerm={searchTerm} />
        )}
      </div>

      {/* Levels information section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Niveles y Desbloqueos</h2>
        <LevelsTable />
      </div>

      {/* Dialogs */}
      <ExperienceModificationDialog
        user={selectedUser}
        open={xpDialogOpen}
        onOpenChange={setXpDialogOpen}
        onSuccess={() => {
          modifyUserXp(
            selectedUser?.id || '', 
            50, // Default amount
            "Modificación manual" // Default description
          );
        }}
      />

      <LevelManagementDialog
        user={selectedUser}
        open={levelDialogOpen}
        onOpenChange={setLevelDialogOpen}
        onSuccess={() => {
          updateUserLevel(
            selectedUser?.id || '', 
            selectedUser?.level || 1
          );
        }}
      />
    </div>
  );
};

export default ExperienceManagement;
