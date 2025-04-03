
import { Profile } from "@/types/profile";
import { Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserTableProps {
  users: Profile[];
  onEditUser: (user: Profile) => void;
}

const UserTable = ({ users, onEditUser }: UserTableProps) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Email Visible</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Fecha de Registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {user.description || "Sin descripción"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {user.email_visible ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" /> Visible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                    <X className="mr-1 h-3 w-3" /> No visible
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    Number(user.level) === 13
                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                      : Number(user.level) >= 8
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }
                >
                  {user.level}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.created_at || "").toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => onEditUser(user)}>
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
