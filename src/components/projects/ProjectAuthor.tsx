
import React from 'react';
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectAuthorProps {
  username: string;
  avatarUrl?: string | null;
}

const ProjectAuthor = ({ username, avatarUrl }: ProjectAuthorProps) => {
  return (
    <Link to={`/user/${username}`} className="flex items-center space-x-2 hover:text-club-terracotta">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{username}</span>
    </Link>
  );
};

export default ProjectAuthor;
