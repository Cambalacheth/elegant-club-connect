
import { Debate } from "@/types/forum";
import { UserRole } from "@/types/user";

export interface DebateCardProps {
  debate: Debate;
  userRole: UserRole;
  userId?: string;
  onVote?: (debateId: string, voteType: "up" | "down") => void;
  onDelete?: (debateId: string) => void;
}

export interface VoteButtonsProps {
  debateId: string;
  votesUp: number;
  votesDown: number;
  commentsCount: number;
  userId?: string;
  onVote?: (debateId: string, voteType: "up" | "down") => void;
}

export interface DeleteButtonProps {
  debateId: string;
  authorId: string;
  userId?: string;
  userRole: UserRole;
  isDeleting: boolean;
  onDelete?: (debateId: string) => void;
}

export interface RoleBadgeProps {
  role: string;
}
