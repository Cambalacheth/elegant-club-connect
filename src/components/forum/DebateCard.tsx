
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2, AlertCircle } from "lucide-react";
import { Debate } from "@/types/forum";
import { UserRole, canModerateContent } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import RichTextDisplay from "./RichTextDisplay";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DebateCardProps {
  debate: Debate;
  userRole: UserRole;
  userId?: string;
  onVote?: (debateId: string, voteType: "up" | "down") => void;
  onDelete?: (debateId: string) => void;
}

const DebateCard = ({ debate, userRole, userId, onVote, onDelete }: DebateCardProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleVote = (voteType: "up" | "down") => {
    if (!userId) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para votar debates",
        variant: "destructive",
      });
      return;
    }

    if (onVote) {
      onVote(debate.id, voteType);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      if (onDelete) {
        onDelete(debate.id);
      }
    } catch (error) {
      console.error("Error deleting debate:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el debate",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es,
    });
  };

  // Prepare preview - first 250 characters of content
  const contentPreview = debate.content.length > 250 
    ? debate.content.substring(0, 250) + "..." 
    : debate.content;

  // Render role badge
  const renderRoleBadge = () => {
    switch (debate.author_role) {
      case "verified":
        return <span className="bg-club-orange/20 text-club-orange text-xs px-2 py-0.5 rounded-full">Verificado</span>;
      case "moderator":
        return <span className="bg-club-green/20 text-club-green text-xs px-2 py-0.5 rounded-full">Moderador</span>;
      case "admin":
        return <span className="bg-club-brown/20 text-club-brown text-xs px-2 py-0.5 rounded-full">Admin</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/forum/${debate.id}`} className="text-lg font-semibold text-club-brown hover:text-club-terracotta transition-colors">
            {debate.title}
          </Link>
          <span className="text-xs text-gray-500">{formatDate(debate.created_at)}</span>
        </div>
        
        <div className="mb-4 text-gray-700 overflow-hidden">
          <div className="line-clamp-3">
            <RichTextDisplay content={contentPreview} className="text-sm" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src={debate.author_avatar || "/placeholder.svg"} 
              alt={debate.author_username} 
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">{debate.author_username}</span>
            {renderRoleBadge()}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => handleVote("up")}
                className="text-gray-500 hover:text-club-green transition-colors"
                aria-label="Votar positivamente"
              >
                <ThumbsUp size={18} />
              </button>
              <span className="text-sm">{debate.votes_up}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => handleVote("down")}
                className="text-gray-500 hover:text-club-terracotta transition-colors"
                aria-label="Votar negativamente"
              >
                <ThumbsDown size={18} />
              </button>
              <span className="text-sm">{debate.votes_down}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <MessageSquare size={18} className="text-gray-500" />
              <span className="text-sm">{debate.comments_count}</span>
            </div>
            
            {(canModerateContent(userRole) || userId === debate.author_id) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Eliminar debate"
                    disabled={isDeleting}
                  >
                    <Trash2 size={18} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      ¿Eliminar debate?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El debate será eliminado permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateCard;
