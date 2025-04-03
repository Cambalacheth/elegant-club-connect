
import { AlertCircle } from "lucide-react";

interface EmptyUserStateProps {
  searchTerm: string;
}

const EmptyUserState = ({ searchTerm }: EmptyUserStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
      <h3 className="text-lg font-medium text-gray-900">No se encontraron usuarios</h3>
      <p className="text-gray-500">
        {searchTerm
          ? "No hay usuarios que coincidan con tu búsqueda."
          : "No hay usuarios registrados en el sistema."}
      </p>
    </div>
  );
};

export default EmptyUserState;
