
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Clock, Tag, Trash2 } from "lucide-react";
import { Debate } from "@/types/forum";
import { canModerateContent, UserRole, UserLevel } from "@/types/user";

interface DebateContentProps {
  debate: Debate;
  userRole: string;
  userId?: string;
  isDeleting: boolean;
  formatDate: (date: string) => string;
  renderRoleBadge: (role: string) => { className: string; text: string } | null;
  onVote: (voteType: "up" | "down") => void;
  onDelete: () => void;
}

const DebateContent: React.FC<DebateContentProps> = ({
  debate,
  userRole,
  userId,
  isDeleting,
  formatDate,
  renderRoleBadge,
  onVote,
  onDelete
}) => {
  // Convert string userRole to UserRole type for type safety
  const typedUserRole = userRole as UserRole;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-club-brown">{debate.title}</h1>
          
          {(canModerateContent(typedUserRole) || userId === debate.author_id) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={18} className="mr-1" />
              Eliminar
            </Button>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Clock size={16} className="mr-1" />
          <span>{formatDate(debate.created_at)}</span>
          <span className="mx-2">•</span>
          <Tag size={16} className="mr-1" />
          <span>{debate.category}</span>
        </div>
        
        <div className="prose max-w-none mb-6">
          {debate.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <img 
              src={debate.author_avatar || "/placeholder.svg"} 
              alt={debate.author_username} 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700">{debate.author_username}</span>
                {/* Render role badge using the new format */}
                {renderRoleBadge(debate.author_role) && (
                  <span className={renderRoleBadge(debate.author_role)?.className || ""}>
                    {renderRoleBadge(debate.author_role)?.text}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => onVote("up")}
                className="text-gray-500 hover:text-club-green transition-colors"
                aria-label="Votar positivamente"
              >
                <ThumbsUp size={18} />
              </button>
              <span className="text-sm">{debate.votes_up}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => onVote("down")}
                className="text-gray-500 hover:text-club-terracotta transition-colors"
                aria-label="Votar negativamente"
              >
                <ThumbsDown size={18} />
              </button>
              <span className="text-sm">{debate.votes_down}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateContent;
