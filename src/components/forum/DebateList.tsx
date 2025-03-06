
import { AlertCircle } from "lucide-react";
import DebateCard from "@/components/forum/DebateCard";
import { Debate } from "@/types/forum";
import { UserRole } from "@/types/user";

interface DebateListProps {
  debates: Debate[];
  isLoading: boolean;
  error: string | null;
  userRole: UserRole;
  userId?: string;
  onVote: (debateId: string, voteType: "up" | "down") => Promise<void>;
  onDelete: (debateId: string) => Promise<void>;
}

const DebateList = ({
  debates,
  isLoading,
  error,
  userRole,
  userId,
  onVote,
  onDelete
}: DebateListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Cargando debates...</p>
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

  if (debates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay debates en esta categoría.</p>
      </div>
    );
  }

  return (
    <div>
      {debates.map((debate) => (
        <DebateCard
          key={debate.id}
          debate={debate}
          userRole={userRole}
          userId={userId}
          onVote={onVote}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DebateList;
