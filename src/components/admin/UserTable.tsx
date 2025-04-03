
import { Edit2 } from "lucide-react";
import { UserLevel } from "@/types/user";
import UserInfo from "./users/UserInfo";
import UserLevelDisplay from "./users/UserLevelDisplay";
import UserTableRow from "./users/UserTableRow";
import UserTableCell from "./users/UserTableCell";
import ActionButton from "./users/ActionButton";

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
            <UserTableRow 
              key={user.id} 
              isSelected={selectedUserId === user.id}
              onClick={() => onEditUser(user)}
            >
              <UserTableCell>
                <UserInfo 
                  username={user.username}
                  avatarUrl={user.avatar_url}
                  description={user.description}
                  userLevel={user.level as UserLevel}
                />
              </UserTableCell>
              <UserTableCell>
                <UserLevelDisplay level={user.level as UserLevel} />
              </UserTableCell>
              <UserTableCell className="text-sm">
                {user.experience || 0} XP
              </UserTableCell>
              <UserTableCell className="text-sm text-gray-600">
                {formatDate(user.created_at)}
              </UserTableCell>
              <UserTableCell>
                <ActionButton
                  onClick={() => onEditUser(user)}
                  icon={<Edit2 size={16} className="text-club-brown" />}
                  label="Editar usuario"
                />
              </UserTableCell>
            </UserTableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
