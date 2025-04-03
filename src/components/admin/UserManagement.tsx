
import { useState } from "react";
import { Profile } from "@/types/profile";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import UserTable from "./UserTable";
import UserEditDialog from "./UserEditDialog";
import EmptyUserState from "./EmptyUserState";
import useAdminUsers from "@/hooks/useAdminUsers";

const UserManagement = () => {
  const { users, isLoading, refetch, searchTerm, setSearchTerm } = useAdminUsers();
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  const handleEditUser = (user: Profile) => {
    setEditingUser(user);
  };

  const handleCloseEditDialog = () => {
    setEditingUser(null);
  };

  const handleSaveUser = () => {
    setEditingUser(null);
    refetch();
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
      ) : users && users.length > 0 ? (
        <UserTable users={users} onEditUser={handleEditUser} />
      ) : (
        <EmptyUserState searchTerm={searchTerm} />
      )}

      <UserEditDialog 
        user={editingUser} 
        onClose={handleCloseEditDialog} 
        onSave={handleSaveUser} 
      />
    </div>
  );
};

export default UserManagement;
