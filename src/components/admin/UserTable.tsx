
import { UserLevel, getLevelName } from "@/types/user";
import UserRoleIcon from "../navbar/UserRoleIcon";
import { Edit2 } from "lucide-react";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

interface UserTableProps {
  users: any[];
  onEditUser: (user: any) => void;
  selectedUserId?: string | null;
}

const UserTable = ({ users, onEditUser, selectedUserId }: UserTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Usuario</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Nivel</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">XP</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Creado</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr 
              key={user.id} 
              className={`border-b hover:bg-gray-50 transition-colors ${selectedUserId === user.id ? "bg-club-beige/20" : ""}`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={`${user.username}'s avatar`} className="h-8 w-8 object-cover" />
                    ) : (
                      <span className="text-xs font-medium">{user.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm flex items-center gap-1">
                      {user.username}
                      <UserRoleIcon userLevel={user.level as UserLevel} />
                    </div>
                    <div className="text-xs text-gray-500">{user.description || "-"}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="bg-club-orange/20 text-club-orange text-xs font-medium px-2 py-1 rounded-full mr-1">
                    {user.level || 1}
                  </span>
                  <span className="text-sm text-gray-700">
                    {getLevelName(user.level as UserLevel)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{user.experience || 0} XP</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.created_at)}</td>
              <td className="px-4 py-3">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-club-beige/20 transition-colors"
                  onClick={() => onEditUser(user)}
                >
                  <Edit2 size={16} className="text-club-brown" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
