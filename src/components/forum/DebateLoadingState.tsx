
import { AlertCircle } from "lucide-react";

interface DebateLoadingStateProps {
  isLoading: boolean;
  error: string | null;
}

const DebateLoadingState: React.FC<DebateLoadingStateProps> = ({ 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Cargando debate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
        <AlertCircle className="mr-2" size={20} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-500">No se encontró el debate solicitado.</p>
    </div>
  );
};

export default DebateLoadingState;
