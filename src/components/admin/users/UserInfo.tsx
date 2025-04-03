
import React from 'react';
import { UserLevel } from "@/types/user";
import UserRoleIcon from "../../navbar/UserRoleIcon";
import UserAvatar from "./UserAvatar";

interface UserInfoProps {
  username: string;
  avatarUrl?: string | null;
  description?: string | null;
  userLevel: UserLevel;
}

const UserInfo = ({ username, avatarUrl, description, userLevel }: UserInfoProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-3">
        <UserAvatar username={username} avatarUrl={avatarUrl} />
      </div>
      <div>
        <div className="font-medium text-sm flex items-center gap-1">
          {username}
          <UserRoleIcon userLevel={userLevel} />
        </div>
        <div className="text-xs text-gray-500">{description || "-"}</div>
      </div>
    </div>
  );
};

export default UserInfo;
